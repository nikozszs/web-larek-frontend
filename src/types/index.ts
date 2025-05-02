export type CategoryStatus = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface IProduct {
    id: string,
    title?: string,
    price: number | null,
    image: string,
    category?: CategoryStatus,
    description?: string,
    totalPrice?: number;
    index?: number;
}

//здесь хранится массив карточек и превью
export interface IProductsData {
    products: IProduct[];
    preview: string | null;
    basket: string[];
    order: IOrder | null;
    loading: boolean;
    toggleOrderedProduct(id: string, isIncluded: boolean): void;
    clearBasket(): void;
    getTotal(): number;
    setProducts(products: IProduct[]): void;
    getProduct(id: string): IProduct;
    deleteProduct(id: string): void;
    updateProduct(product: IProduct, payload: Function | null): void;
    checkValidation(data: Record<keyof ModalPayment | keyof ModalContacts, string>): boolean;
}

export interface IUserData {
    address: string;
    email: string;
    phone: string;
    payment: string;
    total: number;
    getInfo(): ModalContacts | ModalPayment;
    setInfo(userData: IUserData): void;
    setAddress(field: string, value: string): void;
    validateContacts(): boolean;
    validateOrder(): boolean;
    setContacts(field: string, value: string): void;
    getOrder(): object;
}

export type PreviewCard = Pick<IProduct, 'id' | 'image' | 'price' | 'title' | 'description' | 'category'>;

export type CardGallary = Pick<IProduct, 'id' | 'price' | 'title' | 'category' | 'image'>;

export type TCardBasket = Pick<IProduct, 'id' | 'price' | 'title' | 'totalPrice' | 'index'>;

export type ModalPayment = Pick<IUserData, 'address' | 'payment'>;

export type ModalContacts = Pick<IUserData, 'email' | 'payment' | 'phone'>;

export type ModalSuccess = Pick<IProduct, 'title' | 'totalPrice'>;

export interface IOrderForm {
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends IOrderForm {
    payment?: string;
    total?: number;
    items?: string[]
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
    id: string;
}