import { IEvents } from "../base/events";
import { Form } from "./Form";
import { IOrderForm } from "../../types";
import { ensureElement } from "../../utils/utils";

export class FormContacts extends Form<IOrderForm> {
    email: HTMLInputElement;
    phone: HTMLInputElement;
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)
        this.phone = ensureElement<HTMLInputElement>('input[name=phone]', container)
        this.email = ensureElement<HTMLInputElement>('input[name=email]', container)
    }

    set _phone(value: string){
        this.phone.value = value;
    }

    set _email(value: string){
        this.email.value = value;
    }
}