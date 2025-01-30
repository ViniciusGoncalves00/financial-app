import { TransactionType } from "../enums/transaction-type";
import { Entity } from "./entity";

export class Transaction extends Entity {
    private _type: TransactionType;
    private _agent: string;
    private _transactionDate: Number;
    private _referenceDate: Number;
    private _value: number;
    private _details: string | null;

    public constructor(id: string | null = null, creationDate: Number, lastModified: Number, name: string, description: string, type: TransactionType, agent: string, transactionDate: Number, referenceDate: Number, value: number, details: string | null){
        super(id, creationDate, lastModified, name, description);

        this._type = type;
        this._agent = agent;
        this._transactionDate = transactionDate;
        this._referenceDate = referenceDate;
        this._value = value;
        this._details = details;
    }

    public GetInfo(){
        return {
            ...super.GetInfo(),

            type: this._type,
            agent: this._agent,
            transactionDate: this._transactionDate,
            referenceDate: this._referenceDate,
            value: this._value,
            details: this._details,
        };
    }
}