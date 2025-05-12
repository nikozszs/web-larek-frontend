import { IActions, IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { CardBase } from "./CardBase";

export class CardCatalog extends CardBase<IProduct> {
    protected _image: HTMLImageElement;
    protected _category: HTMLSpanElement;
    protected color: Record<string, string> = {
        "софт-скил": 'soft',
         "другое": 'other',
         "дополнительное": 'additional',
         "кнопка": 'button',
         "хард-скил": 'hard', 
    }

    constructor(container: HTMLElement, actions?: IActions) {
            super(container, actions)
            this._image = ensureElement<HTMLImageElement>('.card__image', container);
            this._category = ensureElement<HTMLElement>('.card__category', container);

            if (actions?.onClick) {
                container.addEventListener('click', actions.onClick);
            }
        }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set category(value: string) { 
        this.setText(this._category, value); 
        this._category.className = `card__category card__category_${
			this.color[value] || 'default'
		}`;
     }

    get category() {
		return this._category.textContent || '';
	}
}