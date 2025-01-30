import { nanoid } from 'nanoid';

export abstract class Entity {
    protected _id: string;
    protected _creationDate: number;
    protected _lastModified: number;
    protected _name: string;
    protected _description: string;
    
    public constructor(
        name: string,
        description: string,
        id: string | null = null,
        creationDate: number = Date.now(),
        lastModified: number = Date.now()
    ) {
        this._id = id ?? nanoid();
        this._creationDate = creationDate;
        this._lastModified = lastModified;
        this._name = name;
        this._description = description;
    }

    public getInfo() {
        return {
            id: this._id,
            creationDate: this._creationDate,
            lastModified: this._lastModified,
            name: this._name,
            description: this._description
        };
    }
}
