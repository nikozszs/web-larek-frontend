import { BasketCard, FormErrors, IOrder, IOrderForm, IProduct } from "../../types";
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
    items: BasketCard[] = [];
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

    addCardBasket(item: IProduct) {
        const index = this.items.indexOf(item);
        if (index >= 0) {
            this.items.splice(index, 1);
        } else {
            this.items.push({...item, index: 0 });
        }
        this.updateIndex();
        this.emitChanges('basket:changed');
    }

    updateIndex(){
        this.items.forEach((item, index) => {
            item.index = index + 1;
        })
    }

    deleteCardBasket(items: BasketCard) {
        this.items = this.items.filter((item) => item.id !== items.id);
        this.updateIndex();
        this.emitChanges('basket:changed');
    }


    getButton(item: IProduct) {
        if (item.price === null) return 'бесценно';
        const itemBasket = this.items.some(itemBasket => itemBasket.id === item.id);
        return itemBasket ? 'Убрать из корзины' : 'В корзину';
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

    setOrderField(field: keyof IOrderForm, value: string){
        this.order[field] = value;
        this.validateOrder();
        console.log(field, value)
    }

    setOrderEmail(value: string){
        this.order.email = value;
    }

    setOrderPhone(value: string){
        this.order.phone = value;
    }

    setOrderAddress(value: string){
        this.order.address = value;
    }

    setOrderPayment(value: string){
        this.order.payment = value
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};

        if(!this.order.email){
            errors.email = 'Необходимо указать почту'
        }
        if(!this.order.address){
            errors.address = 'Необходимо указать адрес'
        }
        if(!this.order.phone){
            errors.phone = 'Необходимо указать телефон'
        }
        if(!this.order.payment){
            errors.payment = 'Необходимо указать способ оплаты'
        }

        this.formErrors = errors;
        this.events.emit('formErrors:changed', this.formErrors);
        return Object.keys(errors). length === 0;
    }

    validateBasket(): boolean {
        return this.items.length > 0;
    }
}