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
import { IProduct, IAppState, ProductsCatalog } from './types';
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
const formContacts = new FormContacts(cloneTemplate(templates.contacts), events);
const formOrder = new FormOrder(cloneTemplate(templates.order), events);

// Изменились элементы каталога
events.on<CatalogChangeEvent>('products:changed', () => {
    page.catalog = productsModel.catalog.map(item => {
        const cardPreview = new CardCatalog(cloneTemplate(templates.cardCatalog));
        return cardPreview.render({
            title: item.title,
            image: item.image,
            category: item.category,
            id: item.id,
            price: item.price,
        });
    });
});


// Получаем товары с сервера
api.getProducts()
    .then(productsModel.setCatalog.bind(productsModel))
    .catch(err => {
        console.error(err);
    });

