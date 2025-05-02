import { IOrder, IOrderResult, IProduct } from "../../types";
import { Api, ApiListResponse } from "../base/api";

export interface IShopAPI {
    getProducts: () => Promise<IProduct[]>;
    getProduct: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
    deleteProduct: (id: string) => Promise<IProduct>;
}

export class ShopAPI extends Api implements IShopAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }
    getProducts(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) => 
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image.replace('.svg', '.png'),
            }))
        );
    }

    getProduct(id: string): Promise<IProduct> {
        return this.get<IProduct>(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.image.replace('.svg', '.png'),
            })
        );
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

    deleteProduct(id: string): Promise<IProduct> {
        return this.post<IProduct>('/product', {id}, 'DELETE');
    }
}