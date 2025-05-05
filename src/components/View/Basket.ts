import { createElement, ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "../base/component";
import { EventEmitter } from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
    deletebutton: HTMLElement;
    submitbutton: HTMLElement;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _submitbutton: HTMLElement;
    protected _basketTemplate: HTMLElement;
    protected _items: HTMLElement[] = [];

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._submitbutton = this.container.querySelector('.button');

        if (this._submitbutton) {
            this._submitbutton.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    get items(): HTMLElement[] {
        return [...this._items];
    }

    set items(items: HTMLElement[]) {
        this._items = [...items]
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this._submitbutton, false);
        } else {
            this.setDisabled(this._submitbutton, true);
        }
    }

    setTotal(total: number): void {
        this.setText(this._total, formatNumber(total));
    }

    clear(): void {
        this.items = [];
        this.setTotal(0);
    }
}
