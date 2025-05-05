import { BasketCard, IOrder } from "../../types";

export interface IBasketData {
    clearBasket(): void;
    getCounter: () => number;
    basketProducts: BasketCard[];
    deleteProduct(value: BasketCard): void;
    selectedProduct(data: BasketCard): void;
    totalPrice: () => number;
}

export class BasketData implements IBasketData {
    order: IOrder = {
            email: '',
            phone: '',
            address: '',
            payment: '',
            items:[]
        }
    basketProducts: BasketCard[];

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

    deleteProduct(value: BasketCard): void {
        const index = this.basketProducts.indexOf(value);
        if (index >= 0) {
            this.basketProducts.splice(index,1);
        }
    }

    //добавление карточки в корзину
    selectedProduct(data: BasketCard): void {
        this.basketProducts.push(data);
    }

    totalPrice() {
        let total = 0;
        this.basketProducts.forEach(product => {
            total = total + product.price;
        })
        return total;
    }
}