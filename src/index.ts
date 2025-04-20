import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';

const events = new EventEmitter();
const api = new ShopAPI(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

//шаблоны


const basket = new BasketModel(events);

events.on('basket:change', (data: { items: string[] }) => {
    //выводим куда то
});


//это была реализация модели данных


//связка этих компонентов сначала инициализация
const basketView = new BasketView(document.querySelector('.basket'));
const basketModel = new BasketModel(events);
const catalogModel = new CatalogModel(events);

function renderBasket(items: string[]) {
    basketView.render(
        items.map(id => {
            const itemView = new BasketItemView(events);
            return itemView.render(catalogModel.getProduct{id});
        })
    );
}

//изменение корзины при рендере
events.on('basket:change', (event: { items: string[] }) => {
    renderBasket(event.items);
});

//при действиях изменяем модель, а после этого случится рендер
events.on('ui:basket-add', (event: { id: string }) => {
    basketModel.add(event.id);
});

events.on('ui:basket-remove', (event: { id: string }) => {
    basketModel.remove(event.id);
});

//подгружаем начальные данные и запускаем процессы
api.getCatalog()
   .then(catalogModel.setItems.bind(catalogModel))
   .catch(err => console.error(err));
