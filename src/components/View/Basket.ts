import { createElement, ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "../base/component";
import { EventEmitter } from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    selected: string[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected list: HTMLElement;
    protected _total: HTMLElement;
    protected submitbutton: HTMLElement;
    protected _items: HTMLElement[] = [];

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this.submitbutton = ensureElement<HTMLElement>('.button', container);

        if (this.submitbutton) {
            this.submitbutton.addEventListener('click', () => {
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
            this.list.replaceChildren(...items);
        } else {
            this.list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    setSelected(items: string[]) {
        if (items.length) {
            this.setDisabled(this.submitbutton, false);
        } else {
            this.setDisabled(this.submitbutton, true);
        }
    }

    updateSubmitButton() {
        this.setDisabled(this.submitbutton, this._items.length === 0);
    }


    setTotal(value: number | null) {
        const formattedValue = value === null ? 'Бесценно' : `${formatNumber(value)} синапсов`;
        this.setText(this._total, formattedValue);
    }

    clear(): void {
        this.items = [];
        this.setTotal(0);
    }
}
