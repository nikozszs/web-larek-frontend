import { IAppState, ProductsCatalog, IOrder, PreviewCard, FormErrors, IOrderForm } from "../../types";
import _ from "lodash";
import { Model } from "../base/Model";

export type CatalogChangeEvent = {
    catalog: ProductsModel[]
};

export class ProductsModel extends Model<IAppState> {
    catalog: ProductsCatalog[];
    loading: boolean;
    preview: PreviewCard;

    getCatalog(): ProductsCatalog[] {
        return this.catalog;
    }

    setCatalog(data: ProductsCatalog[]) {
        this.catalog = data;
        this.emitChanges('products:changed');
    }

    getPreview(): PreviewCard | null {
        return this.preview;
    }

    setPreview(item: PreviewCard) {
        this.preview = item;
        this.emitChanges('card:select', item)
    }
}