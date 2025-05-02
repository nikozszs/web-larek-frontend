import { createElement, ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "../base/component";
import { EventEmitter } from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
    onClick?: (event: MouseEvent) => void;
    onSubmit?: (price: number) => void;
    onDelete?: (id: string) => void;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _deletebutton: HTMLElement;
    protected _submitbutton: HTMLElement;
    protected _basketTemplate: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter, actions?: { onDelete: IBasketView['onClick']; onSubmit: IBasketView['onClick']; }) {
        super(container);
        this._basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._deletebutton = this.container.querySelector('.basket-delete');
        this._submitbutton = this.container.querySelector('.button');

        if (this._submitbutton) {
            this._submitbutton.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        if (this._deletebutton) {
            this._deletebutton.addEventListener('click', () => {
                events.emit('order:delete');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
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
            this.setDisabled(this._deletebutton, false);
        } else {
            this.setDisabled(this._deletebutton, true);
        }
    }

    set total(total: number) {
        this.setText(this._total, formatNumber(total));
    }
}
