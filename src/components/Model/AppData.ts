import { IAppState, ProductsCatalog, IOrder, PreviewCard, FormErrors } from "../../types";
import _ from "lodash";
import { Model } from "../base/Model";

export class AppState extends Model<IAppState> {
    catalog: ProductsCatalog[];
    loading: boolean;
    preview: PreviewCard | null;

    getCatalog(): ProductsCatalog[] {
        return this.catalog;
    }

    setCatalog(data: ProductsCatalog[]) {
        this.catalog = data;
        // console.log(data)
        this.emitChanges('products:changed');
    }

    getPreview(): PreviewCard | null {
        return this.preview;
    }

    setPreview(item: PreviewCard) {
        this.preview = item;
        this.emitChanges('PreviewCard:open', item)
    }
}


export class FormsModel extends Model<IOrder> {
    total: number;
    price: number;
    items: string[];
    email: string;
    phone: string;
    address: string;
    payment: string;
    formErrors: FormErrors = {};
    order: IOrder = {
        email: '',
        phone: '',
        address: '',
        payment: '',
        items: []
    }

    setContacts(field: string, value: string): void {
        if (field === 'email') {
            this.email = value;
        } else if (field === 'phone'){
            this.phone = value;
        }

        if (this.validateContacts()){
            this.emitChanges('order:submit', this.getOrder());
        }
    }

    setAddress(field: string, value: string): void {
        if (field === 'address'){
            this.address = value;
        }

        if(this.validateOrder()){
            this.emitChanges('order:submit', this.getOrder())
        }
    }

    getOrder() {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
            total: this.total,
            items: this.items,
        }
    }

    validateContacts(): boolean {
        return this.email.trim() !== '' && this.phone.trim() !== '';
    }

    validateOrder(): boolean {
        return (
            this.address.trim() !== '' &&
            this.payment.trim() !== '' &&
            this.phone.trim() !== '' &&
            this.email.trim() !== ''
        );
    }
}