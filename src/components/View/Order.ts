import { IOrderForm } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "./Form";

export class OrderOnline extends Form <IOrderForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}

export class OrderOffline extends Form <IOrderForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}

//Можно взять Order и его исправить и еще 
// копию с него сделать и вторую форму реализовать. 