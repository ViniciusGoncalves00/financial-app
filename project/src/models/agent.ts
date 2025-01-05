import { Base } from "./base";

export abstract class Agent extends Base {
    
    public constructor(id: number, creationDate: Date, lastModified: Date, name: string, description: string, value: number){
    	super(id, creationDate, lastModified, name, description)
    }

    public Get(){
        return {
            ...super.Get(),
        };
    }
}