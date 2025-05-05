import { IActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { CardCatalog } from "./CardCatalog";

export class CardPreview extends CardCatalog {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IActions){
        super(container, actions);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.button', container);

        if (actions.onClick){
            if (this._button){
                this._button.addEventListener('click', actions.onClick)
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
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