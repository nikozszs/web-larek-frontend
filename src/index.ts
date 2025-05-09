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
import { IProduct } from './types';
import { FormContacts } from './components/View/FormContacts';
import { BasketData } from './components/Model/BasketData';
import { FormOrder } from './components/View/FormOrder';
import { Success } from './components/View/Success';

//events
const events = new EventEmitter();
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})
// events.onAll(({ eventName, data }) => {
//     if (eventName === 'basket:changed') {
//         console.log(basketModel.getProductsOrder());
//     }
// });

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
    events.emit('basket:changed');
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
    events.emit('basket:changed')
})

// удалить карточку из корзины
events.on('card:deleteBasket', (item: IProduct) => {
    basketModel.deleteCardBasket(item);
    events.emit('basket:changed')
})

// окно с адресом и оплатой 
events.on('order:open', () => {
    modal.render({
        content: order.render({
            phone: '',
            email: '',
            payment: '',
            address: '',
            valid: false,
            errors: []
        })
    })
})

//окно успеха
events.on('order:submit', () => {
    api.orderProducts(basketModel.order)
        .then((result) => {
            const success = new Success(cloneTemplate(templates.success), {
                onClick: () => {
                    modal.close();
                    basketModel.clearBasket();
                    events.emit('basket:changed')
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

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});