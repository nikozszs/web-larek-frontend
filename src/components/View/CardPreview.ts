import { IActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { CardCatalog } from "./CardCatalog";

export class CardPreview extends CardCatalog  {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IActions){
        super(container, actions);
        // console.log(container)
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.button', container);

        this._button.addEventListener('click', (evt) => {
            evt.preventDefault();
            if (actions?.onClick) {
                actions.onClick(evt);
            }
        });
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set button(value: string) {
        this.setText(this._button, value)
    }
}