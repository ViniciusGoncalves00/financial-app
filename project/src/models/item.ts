import { Entity } from "./entity";

export abstract class Item extends Entity {
    protected _value: number[];
    
    public constructor(id: string | null = null, creationDate: number, lastModified: number, name: string, description: string, value: number){
    	super(id, creationDate, lastModified, name, description)

        this._value = [];
        this._value.push(value);
    }

    public GetInfo(){
        return {
            ...super.GetInfo(),

            value: this._value,
        };
    }
}