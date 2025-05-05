import { EventEmitter, IEvents } from './components/base/events';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { Page } from './components/View/Page';
import { UserData } from './components/Model/UserData';
import { ShopAPI } from './components/Model/ShopAPI';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardBasket} from './components/View/CardBasket';
import { CardCatalog} from './components/View/CardCatalog';
import { CardPreview} from './components/View/CardPreview';
import { CatalogChangeEvent, ProductsData } from './components/Model/ProductsData';
import { IProduct, IProductsData } from './types';
import { isPlainObject } from 'lodash';
import { FormContacts } from './components/View/FormContacts';
import { BasketData } from './components/Model/BasketData';
import { FormOrder } from './components/View/FormOrder';


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
const formContacts = new FormContacts(templates.contacts, events);
const formOrder = new FormOrder(templates.order, events);


//Отображение карточек на главной странице
const product: IProduct = {
        id: "854cef69-976d-4c2a-a18c-2aa45046c390",
        title: "+1 час в сутках",
        price: 750,
        image: "/5_Dots.svg",
        category: "софт-скил",
        description:  "Если планируете решать задачи в тренажёре, берите два."
    
}

const testCard = new CardCatalog(templates.cardCatalog, events,
    {
        onClick: () => console.log('Карточка нажата')
    }
);
const render = testCard.render(product)
console.log('экземпляр', testCard)
console.log('рендер', render)
console.log('свойства', {
    id: testCard.id,
    title: testCard.title,
    price: testCard.price,
    image: testCard.image,
    category: testCard.category
})

// Отображение превью карточки 
events.on('preview:add', (product: IProduct) => {
    productsData.setPreview(product)
})


//Ответ с сервера

api.getProducts()
    .then(products => productsData.catalog = products)
    .catch((error) => {
        console.error(error)
    })

// Открыть корзину
