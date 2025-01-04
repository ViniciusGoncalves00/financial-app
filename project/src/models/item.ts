export abstract class Item {
    protected _id: number;
    protected _name: string;
    protected _type: Type;
    protected _creationDate: Date;
    protected _lastModified: Date;
    protected _value: number[];
    protected _description: string;
    
    public constructor(id: number, creationDate: Date, lastModified: Date, name: string, description: string, type: Type, value: number){
        this._id = id;
        this._creationDate = creationDate;
        this._lastModified = lastModified;
        this._name = name;
        this._description = description;
        this._type = type;
        this._value = [];
        this._value.push(value);
    }

    public GetItem(){
        const item = {
            id: this._id,
            name: this._name,
            creationDate: this._creationDate,
            lastModified: this._lastModified,
            value: this._value,
            description: this._description
        };

        return item;
    }
}