export type CategoryStatus = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface IActions {
    onClick?: (event: MouseEvent) => void;
    onSubmit?: (price: number) => void;
    onDelete?: (event: MouseEvent) => void
    onButtonClick?: (event: MouseEvent) => void;
}

export type ProductsCatalog = Pick<IProduct, 'id' | 'image' | 'price' | 'title' | 'category'>;

export type PreviewCard = Pick<IProduct, 'id' | 'image' | 'price' | 'description'| 'title' | 'category'>;

export type BasketCard = Pick<IProduct, 'id' | 'price' | 'title' | 'index' | 'total'>;

export interface IProduct {
    total: number;
    id: string,
    title: string,
    price: number | null,
    image: string,
    category: string,
    description: string,
    index: number;
}

export interface IAppState {
    catalog: ProductsCatalog[];
    order: IOrder;
    errors: FormErrors;
    preview: string;
    setPreview(item: PreviewCard): void;
}

export interface IOrderForm {
    email: string;
    phone: string;
    address: string;
    payment: string;
}

export interface IOrder extends IOrderForm {
    total?: number;
    items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
    total: number;
    id: string
}