import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Tabs } from './components/common/Tabs';
import { Page } from './components/Page';
import { Order } from './components/Order';
import { ShopAPI } from './components/ShopAPI';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
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
const tabs = new Tabs(cloneTemplate(orderTemplate), {
    onClick: (name) => {
        if (name === 'closed') events.emit('basket:open');
        else events.emit('products:open');
    }
});
const contacts = new Order(cloneTemplate(contactsTemplate), events);

