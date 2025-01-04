import "./unit-of-measure"

export class Product {
    private _id: number;
    private _name: string;
    private _unitOfMeasure: UnitOfMeasure;
    private _amount: number;
    private _creationDate: Date;
    private _lastModified: Date;
    private _value: number[];
    private _description: string;
    
    public constructor(id: number, name: string, unitOfMeasure: UnitOfMeasure, amount: number, creationDate: Date, lastModified: Date, value: number, description: string){
        this._id = id;
        this._name = name;
        this._unitOfMeasure = unitOfMeasure;
        this._amount = amount;
        this._creationDate = creationDate;
        this._lastModified = lastModified;
        this._value = [];
        this._value.push(value);
        this._description = description;
    }

    public GetProduct(){
        const product = {
            id: this._id,
            name: this._name,
            unitOfMeasure: this._unitOfMeasure,
            amount: this._amount,
            creationDate: this._creationDate,
            lastModified: this._lastModified,
            value: this._value,
            description: this._description
        };

        return product;
    }
}