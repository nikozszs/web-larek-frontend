import { EventEmitter, IEvents } from './components/base/events';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { Page } from './components/View/Page';
import { UserData } from './components/Model/UserData';
//import { Order } from './components/Order';
import { ShopAPI } from './components/Model/ShopAPI';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { PreviewCard, CardItemGallary, CardItemBasket  } from './components/View/Card';
import { ProductsData } from './components/Model/ProductsData';
import { IProduct, IProductsData } from './types';
import { isPlainObject } from 'lodash';


//экземпляры классов
const events = new EventEmitter();
const productsData = new ProductsData(events);
const userData = new UserData(events)
const api = new ShopAPI(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

//шаблоны
const templates = {
    contacts: ensureElement<HTMLTemplateElement>('#contacts'),
    order: ensureElement<HTMLTemplateElement>('#order'),
    basket:ensureElement<HTMLTemplateElement>('#basket'),
    cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
    cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
    cardCatalog: ensureElement<HTMLTemplateElement>('#card-preview'),
    success:ensureElement<HTMLTemplateElement>('#success'),
}

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const cardBasket = new Basket(cloneTemplate(cardBasketTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
//const contacts = new Contacts(contactsTemplate, events);
//const order = new Order(orderTemplate, events);
//const basketModel = ;
//const formModel = (events);


//Ответ с сервера
api.getProducts()
    .then(products => {
        productsData.setProducts(products);
    })
    .catch((error) => {
        console.error(error)
    })

//Отображение карточек на главной странице
events.on('products:changed', () => {
    page.catalog = productsData.products;
});

events.on('card:add', (data: { product: IProduct }) => {
    productsData.toggleOrderedProduct(data.product.id, true);
    page.counter = productsData.order.items.length;
});
