//Смотри схему. Базовый класс, в нем цена и название.От него наследник карточка для каталога, 
// расширяем и добавляем картинку, категорию.От него (от карточки каталога) наследуемся и еще расширяем, добавляя подробное описание

import { IProduct } from "../../types";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

export class CardBase<T extends IProduct> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _events: IEvents;
    protected _id: string = '';

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._events = events;
        this._title = container.querySelector('.card__title');
        this._price = container.querySelector('.card__price');
    }

    set id(value: string) {
        this._id = value;
    }

    get id(): string {
        return this._id || '';
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
}