import { EventEmitter } from './components/base/events';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { Page } from './components/View/Page';
import { ShopAPI } from './components/Model/ShopAPI';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardBasket} from './components/View/CardBasket';
import { CardCatalog} from './components/View/CardCatalog';
import { CardPreview} from './components/View/CardPreview';
import { CatalogChangeEvent, ProductsModel } from './components/Model/AppData';
import { IOrder, IOrderForm, IProduct } from './types';
import { FormContacts } from './components/View/FormContacts';
import { BasketData } from './components/Model/BasketData';
import { FormOrder } from './components/View/FormOrder';
import { Success } from './components/View/Success';

//events
const events = new EventEmitter();
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})


//шаблоны
const templates = {
    contacts: ensureElement<HTMLTemplateElement>('#contacts'),
    order: ensureElement<HTMLTemplateElement>('#order'),
    basket: ensureElement<HTMLTemplateElement>('#basket'),
    cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
    cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
    cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
    success: ensureElement<HTMLTemplateElement>('#success'),
}

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Части интерфейса
const productsModel = new ProductsModel({}, events);
const api = new ShopAPI(CDN_URL, API_URL);
const basketModel = new BasketData({}, events);
const basket = new Basket(cloneTemplate(templates.basket), events);
const contacts = new FormContacts(cloneTemplate(templates.contacts), events);
const order = new FormOrder(cloneTemplate(templates.order), events);
const success = new Success(cloneTemplate(templates.success), {
    onClick: () => {
        modal.close();
        basketModel.clearBasket();
        events.emit('basket:changed');
    }
});

// Получаем товары с сервера
api.getProducts()
    .then(productsModel.setCatalog.bind(productsModel))
    .catch(err => {
        console.error(err);
});

// Вывод карточек каталога на главный экран
events.on<CatalogChangeEvent>('products:changed', () => {
    page.catalog = productsModel.catalog.map(item => {
        const cardCatalog = new CardCatalog(cloneTemplate(templates.cardCatalog), {
            onClick: () => events.emit('card:select', item)
        });
        return cardCatalog.render({
            title: item.title,
            image: item.image,
            category: item.category,
            id: item.id,
            price: item.price,
        });
    });
    page.counter = basketModel.getCounter();
});

// открыть модалку корзины
events.on('basketModal:open', () => {
    modal.render({
        content: basket.render()
    })
})

// изменить корзину
events.on('basket:changed', () => {
    basket.setTotal(basketModel.getTotalPrice());
    page.counter = basketModel.getCounter();
    basket.items = basketModel.getProductsOrder().map(item => {
        const cardBasket = new CardBasket(cloneTemplate(templates.cardBasket), {
            onClick: () => events.emit('preview:changed', item),
            onDelete: () => events.emit('card:deleteBasket', item)
        });

        return cardBasket.render({
            title: item.title,
            index: item.index,
            id: item.id,
            price: item.price,
        });
    });

    modal.render({
        content: basket.render()
    });
})

// открыть карточку как превью
events.on('card:select', (item: IProduct) => {
    productsModel.setPreview(item)
})

// изменить карточку превью
events.on('preview:changed', (item: IProduct) => {
    const showItem = (item: IProduct) => {
        const cardPreview = new CardPreview(cloneTemplate(templates.cardPreview), {
            onClick: () => {
                events.emit('card:addBasket', item);
                modal.close();
            }
    });
    modal.render({
        content: cardPreview.render({
            title: item.title,
            image: item.image,
            category: item.category,
            id: item.id,
            price: item.price,
            description: item.description,
            button: basketModel.getButton(item),
        }),
    });
    }
    if (item) {
        api.getProduct(item.id)
        .then((result) => {
            item.description = result.description;
            showItem(item);
        })
        .catch((err) => {
            console.error(err);
        })
    } else {
        modal.close();
    }
});

// добавить карточку в коризну
events.on('card:addBasket', (item: IProduct) => {
    basketModel.addCardBasket(item);
})

// Обраюотчик способа оплаты
events.on('payment:changed', (data: { payment: string }) => {
    basketModel.setOrderField('payment', data.payment)
})

// удалить карточку из корзины
events.on('card:deleteBasket', (item: IProduct) => {
    basketModel.deleteCardBasket(item);
    events.emit('basket:changed')
})

// Окно с адресом и оплатой 
events.on('order:open', () => {
    modal.render({
        content: order.render({
            address: '',
            valid: false,
            errors: []
        })
    })
})

//Изменения в заказе
events.on('order:changed', (data: { payment: string; address: string}) => {
    order.updatePaymentButtons();
    basketModel.setOrderField('payment', data.payment);
    basketModel.setOrderField('address', data.address);
    if (basketModel.validateOrder()) {
        events.emit('order:submit');
    }
})

// Окно с имеил и телефоном
events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    })
});

//Изменения в заказе
events.on('contacts:changed', (data: { email: string; phone: string}) => {
    basketModel.setOrderField('email', data.email);
    basketModel.setOrderField('phone', data.phone);
    if (basketModel.validateOrder()) {
        events.emit('contacts:submit');
    }
})

// обработчик ошибок форм
events.on('formErrors:changed', (errors: Partial<IOrderForm>) => {
    const { address, phone, email, payment } = errors;

    order.valid = !errors.address && !errors.payment;
    order.errors = Object.values({payment, address}).filter((i) => !!i).join('; ');
    contacts.valid = !errors.email && !errors.phone;
    contacts.errors = Object.values({email, phone}).filter((i) => !!i).join('; ');
})

// изменилось одно из полей
events.on(/^order\..*:changed/, (data: { field: keyof Pick<IOrderForm, 'address'>; value: string }) => {
    basketModel.setOrderField(data.field, data.value);
});

// изменилось одно из полей
events.on(/^contacts\..*:changed/, (data: { field: keyof Pick<IOrderForm, 'email' | 'phone'>; value: string }) => {
    basketModel.setOrderField(data.field, data.value);
});

// Окно успеха
events.on('contacts:submit', () => {
    const orderData: IOrder = {
        ...basketModel.order,
        items: basketModel.items.map(item =>
            item.id),
        total: basketModel.getTotalPrice()
    }
    api.orderProducts(orderData)
        .then((result) => {
            modal.render({
                content: success.render({
                    total: result.total,
                    description: `Списано ${result.total} синапсов`
                })
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});