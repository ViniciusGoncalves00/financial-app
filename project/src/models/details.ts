import { nanoid } from "nanoid";

export class Details {
    protected _id: string;
    protected _creationDate: number;
    protected _lastModified: number;
    protected _products: { product: string; quantity: number }[];

    public constructor(
        id: string | null = null,
        creationDate: number = Date.now(),
        lastModified: number = Date.now(),
        products: { product: string; quantity: number }[] = []
    ) {
        this._id = id ?? nanoid();
        this._creationDate = creationDate;
        this._lastModified = lastModified;
        this._products = products;
    }

    public getInfo() {
        return {
            id: this._id,
            creationDate: this._creationDate,
            lastModified: this._lastModified,
            products: this._products
        };
    }
}
