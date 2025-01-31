import { nanoid } from "nanoid";

export class Details {
    protected _id: string;
    protected _products: { product: string; quantity: number }[];

    public constructor(
        id: string | null = null,
        products: { product: string; quantity: number }[] = []
    ) {
        this._id = id ?? nanoid();
        this._products = products;
    }

    public getInfo() {
        return {
            id: this._id,
            products: this._products
        };
    }
}
