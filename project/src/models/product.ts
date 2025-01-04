import { Item } from "./item";

export class Product extends Item {
    private _unitOfMeasure: UnitOfMeasure;
    private _amount: number;
    
    public constructor(id: number, creationDate: Date, lastModified: Date, name: string, description: string, type: Type, value: number, unitOfMeasure: UnitOfMeasure, amount: number){
        super(id, creationDate, lastModified, name, description, type, value);

        this._unitOfMeasure = unitOfMeasure;
        this._amount = amount;
    }

    public GetItem() {
        return {
            ...super.GetItem(),
            unitOfMeasure: this._unitOfMeasure,
            amount: this._amount
        };
    }
}