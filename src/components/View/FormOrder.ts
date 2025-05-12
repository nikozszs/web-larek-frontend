import { IOrderForm } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "./Form";

export class FormOrder extends Form<IOrderForm> {
    protected card: HTMLButtonElement; 
    protected cash: HTMLButtonElement;
    protected address: HTMLInputElement;
    selectedpayment: string = '';

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events)

        this.card = ensureElement<HTMLButtonElement>('button[name=card]', container);
        this.cash = ensureElement<HTMLButtonElement>('button[name=cash]', container);
        this.address = ensureElement<HTMLInputElement>('input[name=address]', container);
        if(this.card) {
            this.card.addEventListener('click', () => this.selectPayment('card'));
        }
        if(this.cash) {
            this.cash.addEventListener('click', () => this.selectPayment('cash'));
        }
        
    }

    selectPayment(type: 'card' | 'cash'): void {
        this.selectedpayment = type;
        this.updatePaymentButtons();
        this.events.emit('payment:changed', { payment: type});
    }

    set _address(value: string){
        this.address.value = value;
    }

    updatePaymentButtons() {
        this.card.classList.toggle('button_alt-active', this.selectedpayment === 'card');
        this.cash.classList.toggle('button_alt-active', this.selectedpayment === 'cash');
    }
}