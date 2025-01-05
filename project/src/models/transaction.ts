import { Agent } from "./agent";
import { Entity } from "./entity";

export class Transaction extends Entity {
    private _type: TransactionType;
    private _agent: Agent;
    private _transactionDate: Date;
    private _referenceDate: Date;
    private _value: number;

    public constructor(id: number, creationDate: Date, lastModified: Date, name: string, description: string, type: TransactionType, agent: Agent, transactionDate: Date, referenceDate: Date, value: number){
    	super(id, creationDate, lastModified, name, description);

        this._type = type;
        this._agent = agent;
        this._transactionDate = transactionDate;
        this._referenceDate = referenceDate;
        this._value = value;
    }

    public Get(){
        return {
            ...super.Get(),

            type: this._type,
            agent: this._agent,
            transactionDate: this._transactionDate,
            referenceDate: this._referenceDate,
            value: this._value,
        };
    }
}