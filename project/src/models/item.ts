import { Base } from "./base";

export abstract class Item extends Base {
    protected _value: number[];
    
    public constructor(id: number, creationDate: Date, lastModified: Date, name: string, description: string, value: number){
    	super(id, creationDate, lastModified, name, description)

        this._value = [];
        this._value.push(value);
    }

    public Get(){
        return {
            ...super.Get(),

            value: this._value,
        };
    }
}