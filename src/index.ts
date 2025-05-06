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
import { IProduct, IAppState, ProductsCatalog, PreviewCard, BasketCard } from './types';
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


const cardBasket = new CardBasket(cloneTemplate(templates.cardBasket));
const basket = new Basket(cloneTemplate(templates.basket), events);
const formContacts = new FormContacts(cloneTemplate(templates.contacts), events);
const formOrder = new FormOrder(cloneTemplate(templates.order), events);
const success = new Success(cloneTemplate(templates.success), {
    onClick: () => {
        events.emit('modal:close')
        modal.close()
    }
})

//вывод карточек каталога на главный экран
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
});

// Открыть товар
events.on('card:select', (item: PreviewCard) => {
        const preview = new CardPreview(cloneTemplate(templates.cardPreview), {
            onClick: () => {
                events.emit('card:addBasket', item)
                modal.close();
            },
        });
        modal.render({
            content: preview.render({
                title: item.title,
                image: item.image,
                category: item.category,
                id: item.id,
                price: item.price,
                description: item.description,
            })
        })
    });

events.on('basket:changed', () => {
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
        });
    });

    basket.setTotal(basketModel.totalPrice());
    basket.setSelected(basketModel.basketProducts.map(item => item.id));
});


// Добавляем карточку товара в корзину
events.on('card:addBasket', (item: BasketCard) => {
    if (!basketModel.basketProducts.some(item => item.id === item.id)) {
        basketModel.selectedProduct(item as CardBasket);
        events.emit('basket:changed')
    }
})

// удаляем карточку товара из корзины
events.on('basket:delete', (item: IProduct) => {
    basketModel.deleteProduct(item.id);
    events.emit('basket:changed');
})

// открываем корзину на главном экране
events.on('basketModal:open', () => {
    events.emit('basket:chanhed');
    modal.render({
        content: basket.getContainer()
    })
})


// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем товары с сервера
api.getProducts()
    .then(productsModel.setCatalog.bind(productsModel))
    .catch(err => {
        console.error(err);
    });

