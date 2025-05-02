import { IProduct, TCardBasket } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { CardBase } from "./CardBase";

export class CardBasket extends CardBase<IProduct> {
    protected _index: HTMLElement;
    protected _deletebutton: HTMLButtonElement;

    constructor(protected template: HTMLTemplateElement, protected events: IEvents, container?: HTMLElement) {
        super(template, events, container);
        this._index = ensureElement<HTMLElement>('.card__title', container);
        this._deletebutton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this._deletebutton.addEventListener('click', (evt) => {
            evt.stopPropagation();
            this.events.emit('cardBasket:remove', { id: this.id});
        });
    }

    set index(value: number) {
        this.setText(this._index, value.toString());
    }

    protected setPrice(value: number | null) {
        if (value === null) {
          return 'Бесценно'
        }
        return String(value) + ' синапсов'
      }

    render(data: Partial<TCardBasket>): HTMLElement {
            super.render(data);
            if (data.index){
                this.index = data.index;
            }
            return this.container;
    }
}