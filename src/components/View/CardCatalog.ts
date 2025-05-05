import { CardGallary, IActions, IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { CardBase } from "./CardBase";

export class CardCatalog extends CardBase<IProduct> {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents, actions?: IActions) {
            super(container, events)
            this._image = ensureElement<HTMLImageElement>('.card__image', container);
            this._category = ensureElement<HTMLElement>('.card__category', container);

            if (actions?.onClick) {
                container.style.cursor = 'pointer';
                container.addEventListener('click', actions.onClick);
            }
        }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set category(value: string) {
        this.setText(this._category, value);
    }
}