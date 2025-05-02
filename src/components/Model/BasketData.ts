import { IProduct } from "../../types";

export interface IBasketData {
    clearBasket(): void;
    getCounter: () => number;
    products: IProduct[];
    deleteProduct(value: IProduct): void;
    selectedProduct(data: IProduct): void;
    totalPrice: () => number;
}

export class BasketData implements IBasketData {
    protected _basketProducts: IProduct[];

    constructor() {
        this._basketProducts = [];
    }

    clearBasket(): void {
        this._basketProducts = [];
    }

    getCounter() {
        return this._basketProducts.length;
    }

    set products(data: IProduct[]) {
        this._basketProducts = data;
    }

    get products() {
        return this._basketProducts;
    }

    deleteProduct(value: IProduct): void {
        const index = this._basketProducts.indexOf(value);
        if (index >= 0) {
            this._basketProducts.splice(index,1);
        }
    }

    //добавление карточки в корзину
    selectedProduct(data: IProduct): void {
        this._basketProducts.push(data);
    }

    totalPrice() {
        let total = 0;
        this._basketProducts.forEach(product => {
            total = total + product.price;
        })
        return total;
    }
}