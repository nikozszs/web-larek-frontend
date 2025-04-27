export type CategoryStatus = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface IProduct {
    id: string,
    title: string,
    price: number,
    image: string,
    category: CategoryStatus,
    description: string,
    totalPrice: number;
}

export interface IUser {
    address: string;
    email: string;
    phone: number;
    payment: string;
}

//здесь хранится массив карточек и превью
export interface IProductsData {
    products: IProduct[];
    preview: string | null;
    deleteProduct(id: string): void;
    updateProduct(product: IProduct, payload: Function | null): void;
    getProduct(id: string): IProduct;
    checkValidation(data: Record<keyof ModalPayment | keyof ModalContacts, string>): boolean;
}

export type ModalProduct = Pick<IProduct, 'id' | 'image' | 'price' | 'title' | 'description' | 'category'>;

export type ModalBasket = Pick<IProduct, 'id' | 'price' | 'title'>;

export type ModalPayment = Pick<IUser, 'address' | 'payment'>;

export type ModalContacts = Pick<IUser, 'email' | 'payment' | 'phone'>;

export type ModalSuccess = Pick<IProduct, 'title' | 'totalPrice'>;

export type ProductUpdate = Pick<IProduct, 'id' | 'image' | 'price'>;

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

//export interface IView {
//    render(data?: object): HTMLElement; // устанавливаем данные, возвращаем контейнер
//}
//export interface IViewConstructor {
//    new (container: HTMLElement, events?: IEventEmitter): IView; // на входе контейнер, в него будем выводить
//}