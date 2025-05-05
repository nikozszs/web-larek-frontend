//Можно взять Order и его исправить и еще 
// копию с него сделать и вторую форму реализовать. 
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IActions } from "../../types";
import { Component } from "../base/component";

export interface IFormContacts {
    errors: HTMLElement;
    formContacts: HTMLFormElement;
    input: HTMLInputElement;
    submitButton: HTMLButtonElement;
    render(): HTMLElement;
}

export class FormContacts extends Component<IFormContacts> {
    errors: HTMLElement;
    input: HTMLInputElement;
    submitButton: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: IEvents, actions?: IActions) {
        super(container)
        this.submitButton = ensureElement<HTMLButtonElement>('.button', container);
        this.errors = ensureElement<HTMLElement>('.form__errors');
        this.input = ensureElement<HTMLInputElement>(`.form__input`, container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as string;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            actions?.onSubmit?.(parseInt(this.input.value));
            return false;
        });
    }

    protected onInputChange(field: string, value: string) {
        this.events.emit(`${this.container}.${String(field)}:change`, {
            field,
            value
        });
    }

    // set phone(value: string) {
    //     (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    // }

    // set email(value: string) {
    //     (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    // }

    set _errors(value: boolean) {
        this.submitButton.disabled = !value;
    }

    render() {
        return this.container;
    }
}