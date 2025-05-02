import { template } from "lodash";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";
import { CardCatalog } from "./CardCatalog";

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.catalog__items');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('bids:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }

    renderProducts(products: IProduct[]) {
        const cardContainer = ensureElement<HTMLElement>('.catalog__items');
            cardContainer.innerHTML = '';

        products.forEach(product => {
            const card = new CardCatalog(
                ensureElement<HTMLTemplateElement>('#card-catalog'), this.events).render(product);
                card.addEventListener('click', () => {
                    this.events.emit('product:select', product);
                });
                cardContainer.append(card);
        })
    }
}