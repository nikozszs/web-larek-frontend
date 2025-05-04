import { CardGallary, IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { CardBase } from "./CardBase";

export interface IActions {
    onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends CardBase<IProduct> {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _container: HTMLElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents, 
        container: HTMLElement, actions?: IActions) {
            const containerCatalog = ensureElement<HTMLElement>('.catalog__items');
            super(template, events, container)
            this._container = containerCatalog;
            this._image = ensureElement('.card__image', this.container) as HTMLImageElement;
            this._category = ensureElement<HTMLElement>('.card__category', this.container);

            if (actions?.onClick) {
                this.container.style.cursor = 'pointer';
                this.container.addEventListener('click', actions.onClick);
            }
        }

    render(data: Partial<CardGallary>): HTMLElement {
        super.render(data);
        if (data.image) {
            this.image = data.image;
        }
        if (data.category) {
            this.category = data.category;
        }
        if (!this.container.parentElement){
            this._container.appendChild(this.container)
        }
        return this.container
    }

    get image(): string {
        return this._image.src;
    }

    set image(value: string) {
        this._image.src = value;
        this._image.alt = this.title;
    }

    set category(value: string) {
        this.setText(this._category, value);
    }
}