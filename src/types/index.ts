export type CategoryStatus = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface IProduct {
    id: string,
    title: string,
    price: number,
    image?: string,
    category?: CategoryStatus,
    description?: string,
  }

export interface IOrderForm {
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: string[]
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