import { IOrderForm } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "./Form";

export class FormOrder extends Form<IOrderForm> {
    protected card: HTMLButtonElement; 
    protected cash: HTMLButtonElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events)

        this.card = container.elements.namedItem('card') as HTMLButtonElement;
        this.cash = container.elements.namedItem('cash') as HTMLButtonElement;

        if(this.card){
            this.card.addEventListener('click', () => {
                this.card.classList.add('button_alt-active')
                this.cash.classList.remove('button_alt-active')
                this.onInputChange('payment', 'card')
            })
        }
        if(this.cash){
            this.card.addEventListener('click', () => {
                this.card.classList.remove('button_alt-active')
                this.cash.classList.add('button_alt-active')
                this.onInputChange('payment', 'cash')
            })
        }
    }

    buttonsDisabl() {
        this.card.classList.remove('button_alt-active')
        this.cash.classList.remove('button_alt-active')
    }
}