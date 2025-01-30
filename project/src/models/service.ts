import { Item } from "./item";

export class Service extends Item {
    private _unitOfMeasure: UnitOfMeasure;
    private _amount: number;

    public constructor(
        name: string,
        description: string,
        value: number,
        unitOfMeasure: UnitOfMeasure,
        amount: number,
        id?: string, 
        creationDate?: number, 
        lastModified?: number
    ) {
        super(name, description, value, id, creationDate, lastModified);

        this._unitOfMeasure = unitOfMeasure;
        this._amount = amount;
    }

    public getInfo() {
        return {
            ...super.getInfo(),
            unitOfMeasure: this._unitOfMeasure,
            amount: this._amount
        };
    }
}
