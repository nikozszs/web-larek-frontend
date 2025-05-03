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
events.on('products:changed', (data: {catalog: IProduct[], count: number}) => 
{
    const gallary = ensureElement<HTMLElement>('.gallery');
    gallary.innerHTML = '';
    data.catalog.forEach(item => {
        const cardCatalog = new CardCatalog(
            templates.cardCatalog,
            events,
            undefined,
            {
                onClick: () => events.emit('card:select', item)
            }
        );
        gallary.appendChild(cardCatalog.render(item))
    })
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
events.on('basketModal:open', () => {
    basket.setTotal(userData.getTotal());
    let i = 0;
    basket.items = userData.productsInBasket.map((item) => {
        const cardBasket = new CardBasket(templates.cardBasket, events.emit('order:delete'. item))
    })
})