//Можно взять Order и его исправить и еще 
// копию с него сделать и вторую форму реализовать. 

import { IEvents } from "../base/events";
import { Form } from "./Form";
import { IOrderForm } from "../../types";

export class FormContacts extends Form<IOrderForm> {
    email: string;
    phone: string;
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)
    }
}