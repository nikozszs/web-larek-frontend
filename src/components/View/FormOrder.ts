import { IOrderForm } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "./Form";

export class FormOrder extends Form<IOrderForm> {
    protected card: HTMLButtonElement; 
    protected cash: HTMLButtonElement;
    protected address: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    selectedpayment: string = '';

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events)

        this.card = ensureElement<HTMLButtonElement>('button[name=card]', container);
        this.cash = ensureElement<HTMLButtonElement>('button[name=cash]', container);
        this.address = ensureElement<HTMLInputElement>('input[name=address]', container);
        this.submitButton = this.container.querySelector('.order__button') as HTMLButtonElement;
        this.submitButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.submitOrder();
        })
        if(this.card) {
            this.card.addEventListener('click', () => this.selectPayment('card'));
        }
        if(this.cash) {
            this.cash.addEventListener('click', () => this.selectPayment('cash'));
        }
        this.address.addEventListener('input', (e) => {
            const value = (e.target as HTMLInputElement).value;
            console.log('Address input value:', value);
            console.log('Address valid:', value.length >= 2);
            this.events.emit('order.address:change', {
                field: 'address',
                value: value
            });
        });
    }

    selectPayment(type: 'card' | 'cash'): void {
        this.selectedpayment = type;
        this.updatePaymentButtons();
        this.events.emit('payment:changed', { payment: type});
    }

    set _address(value: string){
        this.address.value = value;
    }

    submitOrder(): void {
        if(this.validateForm()) {
            this.events.emit('order:submit', {
                payment: this.selectedpayment,
                address: this.address.value
            })
            this.events.emit('contacts:open');
        }
    }

    updatePaymentButtons() {
        this.card.classList.toggle('button_alt-active', this.selectedpayment === 'card');
        this.cash.classList.toggle('button_alt-active', this.selectedpayment === 'cash');
    }

    validateForm(): boolean {
        const errors: Partial<IOrderForm> = {};
        const addressValue = this.address.value?.trim() || '';

        if(addressValue.length < 2){
            errors.address = 'Необходимо указать адрес'
        }

        if(!this.selectedpayment){
            errors.payment = 'Необходимо указать способ оплаты'
        }
        
        this.events.emit('formErrors:changed', errors);
        console.log(this.address.value)
        console.log(this.selectPayment)
        return Object.keys(errors). length === 0;
    }
}