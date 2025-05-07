import { filter } from "lodash";
import { BasketCard, FormErrors, IOrder, IProduct } from "../../types";
import { Model } from "../base/Model";

export interface IBasketData extends IOrder{
    clearBasket(): void;
    getCounter: () => number;
    deleteProduct(value: BasketCard): void;
    selectedProduct(data: BasketCard): void;
    formErrors: FormErrors;
    order: IOrder;
    total: number | null;
    items: BasketCard[];
}

export class BasketData extends Model<IBasketData>{
    order: IOrder = {
            email: '',
            phone: '',
            address: '',
            payment: '',
            items:[]
    }
    total: number | null = 0;
    items: BasketCard[] =[];
    formErrors: FormErrors = {};
    email: string;
    phone: string;
    address: string;
    payment: string;
    price: number;

    clearBasket() {
        this.items = [];
        this.total = null;
    }

    cardBasketToggle(item: IProduct) {
        return !this.items.some((item) => item.id === item.id) ? this.addCardBasket(item) : this.deleteCardBasket(item);
    }

    addCardBasket(item: IProduct) {
        this.items = [... this.items, item];
        this.emitChanges('basket:changed');
    }

    deleteCardBasket(item: BasketCard){
        const index = this.items.indexOf(item);
        if (index >= 0) {
            this.items.splice(index,1);
        }
        this.items = this.items.filter((item) => item.id !== item.id);
        this.emitChanges('basket:changed');
    }

    getButton(item: IProduct) {
        if (item.price === null) {
            return 'бесценно';
        }
        if (!this.items.some((item) => item.id == item.id)) {
            return 'В корзину';
        } else {
            return 'Убрать из корзины';
        }
    }

    getCounter() {
        return this.items.length;
    }

    set products(data: BasketCard[]) {
        this.items = data;
    }

    getProductsOrder(): BasketCard[] {
        return this.items;
    }

    getTotalPrice() {
        const hasNullPrices = this.items.some(item => item.price === null);
        if (hasNullPrices) return null;
        
        return this.items.reduce((sum, product) => sum + (product.price || 0), 0);
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