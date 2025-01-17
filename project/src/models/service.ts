import { Item } from "./item";

export class Service extends Item {
    private _unitOfMeasure: UnitOfMeasure;
    private _amount: number;
    
    public constructor(id: number, creationDate: Date, lastModified: Date, name: string, description: string, value: number, unitOfMeasure: UnitOfMeasure, amount: number){
        super(id, creationDate, lastModified, name, description, value);

        this._unitOfMeasure = unitOfMeasure;
        this._amount = amount;
    }

    public Get() {
        return {
            ...super.Get(),
            
            unitOfMeasure: this._unitOfMeasure,
            amount: this._amount
        };
    }
}