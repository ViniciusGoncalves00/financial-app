import { Entity } from "./entity";

export abstract class Item extends Entity {
    protected _value: number[];

    public constructor(
        name: string,
        description: string,
        value: number,
        id?: string,
        creationDate?: number,
        lastModified?: number
    ) {
        super(name, description, id, creationDate, lastModified);

        this._value = [value];
    }

    public getInfo() {
        return {
            ...super.getInfo(),
            value: this._value,
        };
    }
}
