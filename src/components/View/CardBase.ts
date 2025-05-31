import { IActions, IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";

export class CardBase<T extends IProduct> extends Component<T> {
    protected title: HTMLElement;
    protected price: HTMLElement;
    protected id: string = '';

    constructor(container: HTMLElement, actions?: IActions) {
        super(container);
        this.title = ensureElement<HTMLElement>('.card__title', container);
        this.price = ensureElement<HTMLElement>('.card__price', container);
    }

    set _id(value: string) {
        this._id = value;
    }

    get _id(): string {
        return this._id || '';
    }

    set _title(value: string) {
        this.setText(this.title, value);
    }

    get _title(): string {
        return this.title.textContent || '';
    }

    set _price(value: number | null) {
        this.setText(this.price, value ? `${value} синапсов` : 'Бесценно');
    }
}