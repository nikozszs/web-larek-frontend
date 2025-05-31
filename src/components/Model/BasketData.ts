import { BasketCard, FormErrors, IOrder, IOrderForm, IProduct } from "../../types";
import { Model } from "../base/Model";

export interface IBasketData extends IOrder{
    formErrors: FormErrors;
    order: IOrder;
    items: string[];
}

export class BasketData extends Model<IBasketData>{
    order: IOrder = {
            email: '',
            phone: '',
            address: '',
            payment: '',
            items:[],
    }
    total: number | null;
    items: BasketCard[] = [];
    formErrors: FormErrors = {};

    clearBasket() {
        this.items = [];
        this.total = null;
        this.emitChanges('basket:changed');
    }
    
    addCardBasket(item: IProduct) {
        if (!this.hasItem(item.id)) {
            this.items = [...this.items, item];
            this.getTotalPrice();
            this.emitChanges('basket:changed');
        }
    }

    deleteCardBasket(itemId: string) {
        this.items = this.items.filter((item) => item.id !== itemId);
        this.getTotalPrice();
        this.emitChanges('basket:changed');
    }

    hasItem(itemId: string): boolean {
        return this.items.some(item => item.id === itemId);
    }

    // getButtonStatus(item: IProduct) {
    //     if (this.hasItem(item.id)) {
    //         this.deleteCardBasket(item.id);
    //     } else {
    //         this.addCardBasket(item);
    //     }
    // }

    getCounter() {
        return this.items.length;
    }

    // set products(data: BasketCard[]) {
    //     this.items = data;
    // }

    getProductsOrder(): BasketCard[] {
        return this.items;
    }

    getTotalPrice() {
        const hasNullPrices = this.items.some(item => item.price === null);
        this.total = hasNullPrices ? null : this.items.reduce((sum, product) => sum + (product.price || 0), 0);
        return this.total;
    }

    isPriceless(item: BasketCard): boolean {
        return item.price === null || item.price === 0;
    }

    setOrderField(field: keyof IOrderForm, value: string){
        this.order[field] = value;
        this.validateOrder();
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};

        if(!this.order.address){
            errors.address = 'Необходимо указать адрес'
        }

        if(!this.order.payment){
            errors.payment = 'Необходимо выбрать способ оплаты'
        }

        if(!this.order.email){
            errors.email = 'Необходимо указать почту'
        }
        
        if(!this.order.phone){
            errors.phone = 'Необходимо указать телефон'
        }

        this.formErrors = errors;
        this.events.emit('formErrors:changed', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}