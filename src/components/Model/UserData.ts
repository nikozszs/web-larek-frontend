import { FormErrors, IOrder, IUserData, ModalContacts, ModalPayment } from "../../types";
import { IEvents } from "../base/events";

export class UserData implements IUserData {
    address: string;
    email: string;
    phone: string;
    payment: string;
    events: IEvents;
    total: number;
    errors: FormErrors = {};

    constructor(events: IEvents) {
        this.events = events;
        this.address = '';
        this.email = '';
        this.phone = '';
        this.total = 0;
        this.payment = '';
    }

    getInfo(): ModalContacts | ModalPayment {
        return { address: this.address, 
            email: this.email, 
            phone: this.phone, 
            payment: this.payment }
    }

    setInfo(userData: IUserData) {
        this.address = userData.address;
        this.email = userData.email;
        this.phone = userData.phone;
        this.payment = userData.payment;
        this.events.emit('user:changed')
    }

    setContacts(field: string, value: string): void {
        if (field === 'email') {
            this.email = value;
        } else if (field === 'phone'){
            this.phone = value;
        }

        if (this.validateContacts()){
            this.events.emit('order:submit', this.getOrder());
        }
    }

    getOrder(): IOrder {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
            total: this.total,
        }
    }

    setAddress(field: string, value: string): void {
        if (field === 'address'){
            this.address = value;
        }

        if(this.validateOrder()){
            this.events.emit('order:submit', this.getOrder())
        }
    }

    validateContacts(): boolean {
        return this.email.trim() !== '' && this.phone.trim() !== '';
    }

    validateOrder(): boolean {
        return (
            this.address.trim() !== '' &&
            this.payment.trim() !== '' &&
            this.phone.trim() !== '' &&
            this.email.trim() !== ''
        );
    }
}