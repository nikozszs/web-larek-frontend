//Смотри схему. Базовый класс, в нем цена и название.От него наследник карточка для каталога, 
// расширяем и добавляем картинку, категорию.От него (от карточки каталога) наследуемся и еще расширяем, добавляя подробное описание

import { IActions, IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";

export class CardBase<T extends IProduct> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _id: string = '';

    constructor(container: HTMLElement, actions?: IActions) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
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