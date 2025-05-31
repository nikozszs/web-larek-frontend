import { IActions, IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { CardBase } from "./CardBase";

export class CardBasket extends CardBase<IProduct> {
    protected index: HTMLElement;
    protected deletebutton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IActions) {
        super(container, actions);
        this.index = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deletebutton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this.deletebutton.addEventListener('click', (evt) => actions.onDelete?.(evt));
    }

    set _index(value: number) {
        this.setText(this.index, value);
    }
}