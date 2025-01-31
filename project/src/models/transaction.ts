import { TransactionType } from "../enums/transaction-type";
import { Entity } from "./entity";

import { Details } from "../models/details";

export class Transaction extends Entity {
    private _type: TransactionType;
    private _agent: string;
    private _transactionDate: number;
    private _referenceDate: number;
    private _value: number;
    private _details: Details | null; // Agora armazena um objeto Details

    public constructor(
        name: string, 
        description: string, 
        type: TransactionType, 
        agent: string, 
        transactionDate: number, 
        referenceDate: number, 
        value: number, 
        details: Details | null,  // Alterado para Details | null
        id?: string, 
        creationDate?: number, 
        lastModified?: number
    ) {
        super(name, description, id, creationDate, lastModified);

        this._type = type;
        this._agent = agent;
        this._transactionDate = transactionDate;
        this._referenceDate = referenceDate;
        this._value = value;
        this._details = details;
    }

    public getInfo() {
        return {
            ...super.getInfo(),
            type: this._type,
            agent: this._agent,
            transactionDate: this._transactionDate,
            referenceDate: this._referenceDate,
            value: this._value,
            details: this._details ? this._details.getInfo().products : [],
        };
    }
}