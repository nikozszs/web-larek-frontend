import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

export interface IFormOrder {
    errors: HTMLElement;
    payment: string;
    formOrder: HTMLFormElement;
    paymentButton: HTMLButtonElement[];
    render(): HTMLElement;
}

export class FormOrder extends Component<IFormOrder> {
    errors: HTMLElement;
    payment: string;
    paymentButton: HTMLButtonElement[];
    submitButton: HTMLButtonElement;
    input: HTMLInputElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)
        this.submitButton = ensureElement<HTMLButtonElement>('.button', container);
        this.errors = ensureElement<HTMLElement>('.form__errors');
        this.input = ensureElement<HTMLInputElement>(`.form__input`, container);
        this.paymentButton = Array.from(this.container.querySelectorAll('.button_alt'))

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as string;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container}:submit`);
            return false;
        });
    }

    protected onInputChange(field: string, value: string) {
        this.events.emit(`${this.container}.${String(field)}:change`, {
            field,
            value
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
        return this.container;
    }
}