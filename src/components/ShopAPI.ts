import { IOrder, IOrderResult, IProduct } from "../types"
import { Api, ApiListResponse } from "./base/api"

export interface IShopAPI {
    getProdustList: () => Promise<IProduct[]>;
    getProduct: (id: string) => Promise<IProduct>;
    getProductUpdate: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
    deleteProduct: (id: string) => Promise<IProduct>;
}

export class ShopAPI extends Api implements IShopAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }
    getProdustList(): Promise<IProduct[]> {
        return this.get<IProduct[]>('/product');
    }

    getProduct(id: string): Promise<IProduct> {
        return this.get<IProduct>(`/product/${id}`);
    }

    getProductUpdate(id: string): Promise<IProduct> {
        return this.get<IProduct>(`/product/update/${id}`);
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.post<IOrderResult>('/order', order);
    }

    deleteProduct(id: string): Promise<IProduct> {
        return this.post<IProduct>('/product', {id}, 'DELETE');
    }

}