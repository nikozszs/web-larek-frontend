import { IUserData, ModalContacts, ModalPayment } from "../../types";
import { IEvents } from "../base/events";

export class UserData implements IUserData {
    address: string;
    email: string;
    phone: number;
    payment: string;
    events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    getInfo(): ModalContacts | ModalPayment {
        return { address: this.address, email: this.email, phone: this.phone, payment: this.payment }
    }
    setInfo(userData: IUserData) {
        this.address = userData.address;
        this.email = userData.email;
        this.phone = userData.phone;
        this.payment = userData.payment;
        this.events.emit('user:changed')
    }
    checkUserValidation(data: Record<keyof ModalContacts | keyof ModalPayment, string>) {
        return Object.values(data).every(value => value.trim() !== '')
    }
}