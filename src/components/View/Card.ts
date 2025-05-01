import { CardBasket, CardGallary } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";

export interface ICardBase{
    id: string;
    title: string;
    price: number;
}

// реализация базовой карточки
export class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._price = container.querySelector(`.${blockName}__price`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
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

    set price(value: number) {
        this.setText(this._price, `${value} синапсов`)
    }

    get title(): string {
        return this._title.textContent || '';
    }
}

// реализация превью карточки товара
export class PreviewCard extends Card<PreviewCard> {
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this._image = ensureElement<HTMLImageElement>(`.${this.blockName}__image`, container);
        this._description = container.querySelector(`.${this.blockName}__text`);
        this._category = container.querySelector(`.${this.blockName}__category`);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set category(value: string) {
        this.setText(this._category, value);
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }
}

// реализация карточки на главной странице
export class CardItemGallary extends Card<CardGallary> {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this._image = ensureElement<HTMLImageElement>(`.${this.blockName}__image`, container);
        this._category = container.querySelector(`.${this.blockName}__category`);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set category(value: string) {
        this.setText(this._category, value);
    }
}

interface ICardActions {
    onClick?: (event: MouseEvent) => void;
    onSubmit?: (price: number) => void;
    onDelete?: (id: string) => void;
}

// реализация карточки в корзине
export class CardItemBasket extends Component<CardBasket> {
    protected _totalPrice: HTMLElement;
    protected _removeButton: HTMLElement;
    protected _submitButton: HTMLElement;

    constructor(container: HTMLElement, 
        actions?: {
            onDelete: ICardActions['onClick'];
            onSubmit: ICardActions['onClick'];
        }) {
            super(container);
            this._totalPrice = ensureElement<HTMLElement>("basket__price",container);
            this._removeButton = ensureElement<HTMLElement>('basket__item-delete', container);
            this._submitButton = ensureElement<HTMLElement>('button', container);

            if(actions?.onDelete){
                this._removeButton.addEventListener('click', actions.onDelete)
            }

            if(actions?.onDelete){
                this._submitButton.addEventListener('click', actions.onSubmit)
            }
        }
    set totalPrice(value: number) {
        this.setText(this._totalPrice, `${value} синапсов`)
    }
}