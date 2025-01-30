import { Item } from "./item";

export class Product extends Item {
    private _unitOfMeasure: UnitOfMeasure;
    private _amount: number;
    
    public constructor(id: string | null = null, creationDate: number, lastModified: number, name: string, description: string, value: number, unitOfMeasure: UnitOfMeasure, amount: number){
        super(id, creationDate, lastModified, name, description, value);

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