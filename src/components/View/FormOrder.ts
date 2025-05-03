import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

// export interface IFormState {
//     valid: boolean;
//     errors: string[];
// }

export interface IFormOrder {
    errors: HTMLElement;
    payment: string;
    formOrder: HTMLFormElement;
    paymentButton: HTMLButtonElement[];
    render(): HTMLElement;
}

// order: IOrder = {
//             email: '',
//             phone: '',
//             address: '',
//             items: []
//         };

export class FormOrder implements IFormOrder {
    errors: HTMLElement;
    payment: string;
    formOrder: HTMLFormElement;
    paymentButton: HTMLButtonElement[];
    submitButton: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]');
        this.errors = ensureElement<HTMLElement>('.form__errors');
        this.formOrder = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
        this.paymentButton = Array.from(this.formOrder.querySelectorAll('.button_alt'))

        this.formOrder.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;
            this.events.emit('order:changeAddress', { field, value });
        });

        this.formOrder.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit('contacts:open');
        });
    }

    set _errors(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set _payment(select: String) {
        this.paymentButton.forEach(btn => {
            btn.classList.toggle('button_alt-active', btn.name === select)
        })
    }

    render() {
        return this.formOrder;
    }
}