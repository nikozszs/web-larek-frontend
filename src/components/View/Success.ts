import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";

interface ISuccess {
    total: number;
    description: string;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected descriptionElement: HTMLElement;
    protected _close: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', container)
        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set description(value: string) {
        this.setText(this.descriptionElement, value)
    }
}