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
import { CardCatalog } from './components/View/Card';
import { ProductsData } from './components/Model/ProductsData';


//экземпляры классов
const events = new EventEmitter();
const productsData = new ProductsData(events);
const userData = new UserData(events)
const api = new ShopAPI(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

//шаблоны
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const cardBasket = new Basket(cloneTemplate(cardBasketTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contacts = new Contacts(contactsTemplate, events);
const order = new Order(orderTemplate, events);
const basketModel = ;
const formModel = (events);


// Отображение карточек на главной странице
events.on('products:changed', () => {
    productsData.products.forEach(it => {
        const card = new CardCatalog(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', it)});
        ensureElement<HTMLElement>('.catalog__items').append(card.render(it));
    });
});