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
import { CardBasket} from './components/View/CardBasket';
import { CardCatalog} from './components/View/CardCatalog';
import { CardPreview} from './components/View/CardPreview';
import { ProductsData } from './components/Model/ProductsData';
import { IProduct, IProductsData } from './types';
import { isPlainObject } from 'lodash';
import { FormContacts } from './components/View/FormContacts';
import { BasketData } from './components/Model/BasketData';


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
    cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
    success:ensureElement<HTMLTemplateElement>('#success'),
}

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const cardBasket = new CardBasket(cloneTemplate(templates.cardBasket), events);
const basket = new Basket(cloneTemplate(templates.basket), events);
//const formContacts = new FormContacts(templates.contacts, events);
//const formOrder = new FormOrder(templates.order, events);
const basketModel = new BasketData;

//Отображение карточек на главной странице
events.on('products:changed', (products: IProduct[]) => {
    page.renderProducts(products);
});

//Ответ с сервера
api.getProducts()
    .then(products => {
        productsData.setProducts(products);
    })
    .catch((error) => {
        console.error(error)
    })