import { IActions, IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { CardCatalog } from "./CardCatalog";

export class CardPreview extends CardCatalog  {
    protected description: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IActions){
        super(container, actions);
        this.description = ensureElement<HTMLElement>('.card__text', container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', container);
        this.button.addEventListener('click', (evt) => {
            if (actions?.onButtonClick) {
                actions.onButtonClick(evt);
            }
        });
    }

    set _description(value: string) {
        this.description.textContent = value;
    }

    set _button(value: string) {
        this.setText(this.button, value)
    }

    updateButtonPreview(isBasket: boolean, isPriceless: boolean) {
        if (isPriceless) {
            this.button.textContent = 'Бесценно';
            this.button.disabled = true;
        } else {
            this.button.textContent = isBasket ? 'Убрать из корзины' : "В корзину";
            this.button.disabled = false;
        }
    }
}