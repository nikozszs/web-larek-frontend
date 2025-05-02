//Смотри схему. Базовый класс, в нем цена и название.От него наследник карточка для каталога, 
// расширяем и добавляем картинку, категорию.От него (от карточки каталога) наследуемся и еще расширяем, добавляя подробное описание

import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

export class CardBase<T extends IProduct> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _events: IEvents;

    constructor(protected template: HTMLTemplateElement, protected events: IEvents, container?: HTMLElement) {
        super(container);
        this._events = events;
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
    }

    render(data: Partial<T>): HTMLElement {
        Object.assign(this as object, data);
        return this.container;
    }
}