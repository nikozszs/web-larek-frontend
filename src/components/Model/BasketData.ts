import { BasketCard, IOrder } from "../../types";

export interface IBasketData {
    clearBasket(): void;
    getCounter: () => number;
    basketProducts: BasketCard[];
    deleteProduct(id: string): void;
    selectedProduct(data: BasketCard): void;
    totalPrice: () => number;
}

export class BasketData implements IBasketData {
    order: IOrder = {
            email: '',
            phone: '',
            address: '',
            payment: '',
            total: null,
            items:[]
        }
    basketProducts: BasketCard[] = [];

    constructor() {
        this.basketProducts = [];
    }

    clearBasket(){
        this.basketProducts = [];
    }

    getCounter() {
        return this.basketProducts.length;
    }

    set products(data: BasketCard[]) {
        this.basketProducts = data;
    }

    get products() {
        return this.basketProducts;
    }

    deleteProduct(id: string): void {
        this.basketProducts = this.basketProducts.filter(item => item.id !== id);
        this.updateOrder();
    }

    //добавление карточки в корзину
    selectedProduct(data: BasketCard): void {
        if (!this.basketProducts.some(item => item.id === data.id)) {
            this.basketProducts.push(data);
            this.updateOrder();
        }
    }

    totalPrice() {
        return this.basketProducts.reduce((sum, item) => sum + (item.price || 0), 0);
    }


    updateOrder(): void {
        this.order.total = this.totalPrice();
        this.order.items = this.basketProducts.map(item => item.id);
    }
}