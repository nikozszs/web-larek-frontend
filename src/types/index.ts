export type CategoryStatus = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface IProduct {
    id: string,
    title?: string,
    price: number,
    image: string,
    category?: CategoryStatus,
    description?: string,
    totalPrice?: number;
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
    getProduct(id: string): IProduct;
    deleteProduct(id: string): void;
    updateProduct(product: IProduct, payload: Function | null): void;
    checkValidation(data: Record<keyof ModalPayment | keyof ModalContacts, string>): boolean;
}

export interface IUserData {
    address: string;
    email: string;
    phone: number;
    payment: string;
    getInfo(): ModalContacts | ModalPayment;
    setInfo(userData: IUserData): void;
    checkUserValidation(data: Record<keyof ModalContacts | keyof ModalPayment, string>): boolean;
}

export type ModalProduct = Pick<IProduct, 'id' | 'image' | 'price' | 'title' | 'description' | 'category'>;

export type ModalBasket = Pick<IProduct, 'id' | 'price' | 'title'>;

export type ModalPayment = Pick<IUserData, 'address' | 'payment'>;

export type ModalContacts = Pick<IUserData, 'email' | 'payment' | 'phone'>;

export type ModalSuccess = Pick<IProduct, 'title' | 'totalPrice'>;

export interface IOrderForm {
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
    id: string;
}
