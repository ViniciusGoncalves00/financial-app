export abstract class Entity {
    protected _id: number;
    protected _creationDate: Number;
    protected _lastModified: Number;
    protected _name: string;
    protected _description: string;
    
    public constructor(id: number, creationDate: Number, lastModified: Number, name: string, description: string){
        this._id = id;
        this._creationDate = creationDate;
        this._lastModified = lastModified;
        this._name = name;
        this._description = description;
    }

    public GetInfo(){
        return {
            id: this._id,
            creationDate: this._creationDate,
            lastModified: this._lastModified,
            name: this._name,
            description: this._description
        };
    }
}