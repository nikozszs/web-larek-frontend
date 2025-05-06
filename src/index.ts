import { EventEmitter, IEvents } from './components/base/events';
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
import { CatalogChangeEvent, FormsModel, ProductsModel } from './components/Model/AppData';
import { IProduct, IAppState, ProductsCatalog, PreviewCard, IOrderForm, BasketCard } from './types';
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
const formsModel = new FormsModel({}, events);
const api = new ShopAPI(CDN_URL, API_URL);
const basketModel = new BasketData();

const cardPreview = new CardPreview(cloneTemplate(templates.cardPreview));
const cardBasket = new CardBasket(cloneTemplate(templates.cardBasket));
const basket = new Basket(cloneTemplate(templates.basket), events);
const contacts = new FormContacts(cloneTemplate(templates.contacts), events);
const order = new FormOrder(cloneTemplate(templates.order), events);

// Получаем товары с сервера
api.getProducts()
    .then(productsModel.setCatalog.bind(productsModel))
    .catch(err => {
        console.error(err);
    });


// Вывод карточек каталога на главный экран
events.on<CatalogChangeEvent>('items:changed', () => {
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

// Открыть товар из галереи
events.on('card:select', (item: PreviewCard) => {
    productsModel.setPreview(item);
    const cardBasket = basketModel.basketProducts.some((cardItemBasket) => cardItemBasket.id === item.id);
    const cardPreview = new CardPreview(cloneTemplate(templates.cardPreview), {
        onClick: () => {
            events.emit('card:addBasket', item)
        },
    });
    modal.render({
        content: cardPreview.render({
            title: item.title,
            image: item.image,
            category: item.category,
            id: item.id,
            price: item.price,
            description: item.description,
        })
    })
});

// Открыть корзину
events.on('basketModal:open', () => {
    page.counter = basketModel.getCounter();
    basket.items = basketModel.basketProducts.map((item, index) => {
        const cardBasket = new CardBasket(cloneTemplate(templates.cardBasket), {
            onClick: () => events.emit('basket:delete', item)
        });
        return cardBasket.render({
            title: item.title,
            index: index + 1,
            id: item.id,
            price: item.price,
        })
    });

basket.setTotal(basketModel.getTotalPrice());
basket.setSelected(basketModel.basketProducts.map(item => item.id));
});



// Отправлена форма заказа
events.on('order:submit', () => {
    api.orderProducts(formsModel.order)
        .then((result) => {
            const success = new Success(cloneTemplate(templates.success), {
                onClick: () => {
                    modal.close();
                    basketModel.clearBasket();
                    events.emit('product:changed');
                }
            });

            modal.render({
                content: success.render({})
            });
        })
        .catch(err => {
            console.error(err);
        });
});


// Изменилось состояние валидации формы заказа
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
    const { payment, address } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
  });
  
// Изменилось состояние валидации формы контактов
events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});
  
// Изменились введенные данные
events.on('orderInput:change', (data: { field: keyof IOrderForm, value: string }) => {
    formsModel.setOrderField(data.field, data.value);
});

// Открыть форму заказа
events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    });
});

// Оформить заказ - открыть форму с адресом
events.on('order:open', () => {
    modal.render({
      content: order.render(
        {
          address: '',
          valid: false,
          errors: []
        }),
    });
});
  
// Заполнить телефон и почту
events.on('order:submit', () => {
    formsModel.order.total = basketModel.getTotalPrice()
    basketModel.setItems();
    modal.render({
        content: contacts.render(
        {
          valid: false,
          errors: []
        }),
    });
})

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});
