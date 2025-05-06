import { BasketCard, FormErrors, IOrder } from "../../types";
import { Model } from "../base/Model";

export interface IBasketData extends IOrder{
    clearBasket(): void;
    getCounter: () => number;
    basketProducts: BasketCard[];
    deleteProduct(value: BasketCard): void;
    selectedProduct(data: BasketCard): void;
    formErrors: FormErrors;
    order: IOrder;
    total: number;
    items: string[];
}

export class BasketData extends Model<IBasketData>{
    order: IOrder = {
            email: '',
            phone: '',
            address: '',
            payment: '',
            items:[]
    }
    total: number;
    items: BasketCard[] =[];
    formErrors: FormErrors = {};
    email: string;
    phone: string;
    address: string;
    payment: string;
    price: number;

    clearBasket(){
        this.items = [];
    }

    getCounter() {
        return this.items.length;
    }

    set products(data: BasketCard[]) {
        this.items = data;
    }

    get products() {
        return this.items;
    }

    deleteProduct(value: BasketCard): void {
        const index = this.items.indexOf(value);
        if (index >= 0) {
            this.items.splice(index,1);
        }
    }

    //добавление карточки в корзину
    selectedProduct(data: BasketCard): void {
        this.items.push(data);
    }

    getTotalPrice() {
        let total = 0;
        this.items.forEach(product => {
            total = total + product.price;
        })
        return total;
    }

    setContacts(field: string, value: string): void {
        if (field === 'email') {
            this.email = value;
        } else if (field === 'phone'){
            this.phone = value;
        }

        if (this.validateContacts()){
            this.emitChanges('order:submit', this.getOrder());
        }
    }

    setAddress(field: string, value: string): void {
        if (field === 'address'){
            this.address = value;
        }

        if(this.validateOrder()){
            this.emitChanges('order:submit', this.getOrder())
        }
    }

    getOrder() {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
            total: this.total,
            items: this.items,
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