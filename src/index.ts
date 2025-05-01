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
//const contacts = new Contacts(contactsTemplate, events);
//const order = new Order(orderTemplate, events);
//const basketModel = ;
//const formModel = (events);


// Отображение карточек на главной странице
api.getProducts()
    .then(products => {
        productsData.setProducts(products);
        renderCatalog(products);
    })
    .catch(err => {
        console.error(err);
    });

function renderCatalog(products: IProduct[]) {
    const container = ensureElement<HTMLElement>('.gallery');
    container.innerHTML = '';
        
    products.forEach(product => {
        const cardElement = cloneTemplate(cardCatalogTemplate);
        const previewElement = cloneTemplate(cardPreviewTemplate);
        const card = new CardItemGallary(cardElement, {
            onClick: () => new PreviewCard(previewElement)
        });
            
        card.id = product.id;
        card.title = product.title;
        card.price = product.price;
        card.image = product.image;
        card.category = product.category;
            
        container.appendChild(card.render());
    });
}