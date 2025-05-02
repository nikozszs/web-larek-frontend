import { PreviewCard } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { CardCatalog } from "./CardCatalog";

export class CardPreview extends CardCatalog {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents, container?: HTMLElement){
        super(template, events, container);
        this._description = ensureElement<HTMLElement>('.card__text', this.container);
        this._button = ensureElement<HTMLButtonElement>('.button', this.container);
        this._button.addEventListener('click', (evt) => {
            evt.stopPropagation();
            this.events.emit('preview:add', { id: this.id});
        });
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }

    render(data: Partial<PreviewCard>): HTMLElement {
        super.render(data);
        if (data.description) {
            this.description = data.description
        }
        return this.container;
    }
}