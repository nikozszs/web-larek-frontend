import { IProduct, IProductsData } from "../../types";
import { IEvents } from "../base/events";
import _ from "lodash";
import { Model } from "../base/Model";

export type CatalogChangeEvent = {
    catalog: ProductsData[]
};

export class ProductsData extends Model<IProductsData> implements IProductsData {
    _catalog: IProduct[];
    _preview: IProduct | null;
    product: IProduct;

    constructor(protected events: IEvents) {
        super({}, events)
    }

    getCatalog(): IProduct[] {
        return this.catalog;
    }

    set catalog(data: IProduct[]) {
        this._catalog = [...data];
        this.events.emit('products:changed'), {
            catalog: this._catalog,
            count: this._catalog.length 
        }
    }

    get preview(): IProduct | null {
        return this._preview;
    }

    set preview(value: IProduct | null) {
        this._preview = value;
    }

    setPreview(item: IProduct): void {
        this._preview = { ...item};
        this.events.emit('PreviewCard:open', {...item})
    }

    getProduct(id: string): IProduct {
        const product = this._catalog.find(value => value.id === id);
        if (!product) {
            throw new Error (`Карточка продукта с id ${id} не найден`);
        }
        return { ... product}
    }
}