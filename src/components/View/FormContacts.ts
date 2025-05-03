//Можно взять Order и его исправить и еще 
// копию с него сделать и вторую форму реализовать. 
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export interface IFormContacts {
    errors: HTMLElement;
    formContacts: HTMLFormElement;
    inputs: HTMLInputElement[];
    submitButton: HTMLButtonElement;
    render(): HTMLElement;
}

// order: IOrder = {
//             email: '',
//             phone: '',
//             address: '',
//             items: []
//         };

export class FormContacts implements IFormContacts {
    errors: HTMLElement;
    formContacts: HTMLFormElement;
    inputs: HTMLInputElement[];
    submitButton: HTMLButtonElement

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]');
        this.errors = ensureElement<HTMLElement>('.form__errors');
        this.formContacts = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
        this.inputs = Array.from(this.formContacts.querySelectorAll('.form__input'))

        this.inputs.forEach(input => {
                input.addEventListener('input', (e: Event) => {
                const target = e.target as HTMLInputElement;
                const field = target.name;
                const value = target.value;
                this.events.emit('contacts:changeInput', { field, value })
            })
        });


        this.formContacts.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit('success:open');
        });
    }

    set _errors(value: boolean) {
        this.submitButton.disabled = !value;
    }

    render() {
        return this.formContacts;
    }
}