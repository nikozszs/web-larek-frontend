import { FormErrors, IOrder, IOrderForm, IProduct, IProductsData, ModalContacts, ModalPayment, PreviewCard } from "../../types";
import { IEvents } from "../base/events";
import _ from "lodash";
import { Model } from "../base/Model";

export type CatalogChangeEvent = {
    catalog: ProductsData[]
};

export class ProductsData extends Model<IProductsData> implements IProductsData {
    catalog: IProduct[];
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
        super({}, events)
    }

    get _catalog(): IProduct[] {
        return [... this.catalog];
    }

    setCatalog(data:IProduct[]): void{
        this.catalog = [...data];
        this.events.emit('products:changed'), {
            catalog: this._catalog,
            count: this._catalog.length 
        }
    }

    getPreview(){
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
            this.events.emit('PreviewCard:open')
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
            this.catalog.find(item => item.id === id);
        });
    }

    getTotal() {
        return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
    }

    deleteProduct(id: string): void {
        this.catalog = this.catalog.filter(product => product.id !== id);
    };
    
    updateProduct(product: IProduct, payload: Function | null){
        const findedProduct = this.catalog.find((value) => value.id == product.id)
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
        const product = this.catalog.find(value => value.id === id);
        if (!product) {
            throw new Error (`Карточка продукта с id ${id} не найден`);
        }
        return { ... product}
    }

    checkValidation(data: Record<keyof ModalPayment | keyof ModalContacts, string>): boolean {
        return Object.values(data).every(value => value.trim() !== '')
    }
}