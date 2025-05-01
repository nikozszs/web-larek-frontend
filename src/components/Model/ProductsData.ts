import { FormErrors, IOrder, IOrderForm, IProduct, IProductsData, ModalContacts, ModalPayment, ModalProduct } from "../types"
import { IEvents } from "./base/events"
import _ from "lodash";

export type CatalogChangeEvent = {
    catalog: ProductsData[]
};

export class ProductsData implements IProductsData {
    _products: IProduct[];
    _preview: string | null;
    events: IEvents;
    product: IProduct;
    basket: string[];
    loading: boolean;
    order: IOrder = {
            email: '',
            phone: '',
            address: '',
            items: []
        };
    formErrors: FormErrors = {};

    constructor(events: IEvents) {
        this.events = events;
    }

    set products(products: IProduct[]) {
        this._products = products;
        this.events.emit('products:changed')
    }

    get products(){
        return this._products;
    }

    get preview(){
        return this._preview;
    }

    set preview(id: string | null) {
        if (!id) {
            this._preview = null;
            return;
        }
        const selectedProduct = this.getProduct(id);
        if (selectedProduct) {
            this._preview = id;
            this.events.emit('product:selected')
        }
    }

    toggleOrderedProduct(id: string, isIncluded: boolean) {
            if (isIncluded) {
                this.order.items = _.uniq([...this.order.items, id]);
            } else {
                this.order.items = _.without(this.order.items, id);
            }
        }
    
    clearBasket() {
        this.order.items.forEach(id => {
            this.toggleOrderedProduct(id, false);
            this._products.find(item => item.id === id);
        });
    }

    getTotal() {
        return this.order.items.reduce((a, c) => a + this._products.find(it => it.id === c).price, 0)
    }

    deleteProduct(id: string): void {
        this._products = this._products.filter(product => product.id !== id);
    };
    
    updateProduct(product: IProduct, payload: Function | null){
        const findedProduct = this._products.find((value) => value.id == product.id)
        if (!findedProduct) {
            this.product
        }
        Object.assign(findedProduct, product)

        if(payload) {
            payload();
        } else {
            this.events.emit('products:changed')
        }
    };

    getProduct(id: string): IProduct {
        const product = this.products.find(value => value.id === id);
        if (!product) {
            throw new Error (`Карточка продукта с id ${id} не найден`);
        }
        return { ... product}
    }

    checkValidation(data: Record<keyof ModalPayment | keyof ModalContacts, string>): boolean {
        return Object.values(data).every(value => value.trim() !== '')
    }
}