import * as fs from 'fs';
import { ICreate } from '../interfaces/icreate';
import { IRead } from '../interfaces/iread';
import { IUpdate } from '../interfaces/iupdate';
import { IDelete } from '../interfaces/idelete';
import { Transaction } from '../models/transaction';
import { PathManager } from './path-manager';
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { TransactionType } from "../enums/transaction-type";
import path from 'path';

export class TransactionsManager implements IRead, IUpdate, IDelete {
    private static _instance: TransactionsManager;

    private _transactions: Transaction[] = [];

    private ROOT : string;
    private folder : string = "";
    private filename : string = "transactions";
    private format : string = "csv";

    private constructor(){
        this.ROOT = PathManager.GetInstance().GetRoot();

        this.Read();
    }

    public static GetInstance() : TransactionsManager {
        if (this._instance == null) {
            this._instance = new TransactionsManager();
        }
        return this._instance;
    }

    public Create(
        name: string,
        type: string,
        agent: string,
        date: string,
        referenceDate: string,
        value: number,
        description: string,
        details?: string)
    {
        const file = path.join(this.ROOT, "database", "transactions.csv")
        
        try {
            if (!fs.existsSync(file)) {
                console.error('Error processing CSV file: file does not exists.');
            }

            const fileContent = fs.readFileSync(file, 'utf-8');
            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            });

            const newId = records.length > 0 ? Math.max(...records.map((r: any) => parseInt(r.id))) + 1 : 1;

            const currentDateTicks = new Date().getTime();
            const transactionDateTicks = new Date(date).getTime();
            const referenceDateTicks = new Date(referenceDate).getTime();
            
            // let detailsPath: string | undefined;
            // if (transactionData.details && fs.existsSync(path.join(this.ROOT, transactionData.details))) {
            //     detailsPath = transactionData.details;
            // }

            let transactionType = TransactionType.Entry
            type = type.toLowerCase();
            try {
                if(type == "entry"){
                    transactionType = TransactionType.Entry;
                }
                else if(type == "exit"){
                    transactionType = TransactionType.Exit;
                }
                else{
                    console.error('Invalid transaction type.');
                }
            }
            catch (error) {
                console.error('Error processing CSV file transaction type:', error);
            }

            const transaction = new Transaction(
                newId,
                currentDateTicks,
                currentDateTicks,
                name,
                description,
                transactionType,
                agent,
                transactionDateTicks,
                referenceDateTicks,
                value,
                details || "",
            )

            const transactionPlain = {
                id: newId,
                creationDate: currentDateTicks,
                lastModifiedDate: currentDateTicks,
                name: name,
                description: description,
                type: type,
                agent: agent,
                transactionDate: transactionDateTicks,
                referenceDate: referenceDateTicks,
                value: value,
                details: details || "",
            };

            this._transactions.push(transaction);
            records.push(transactionPlain);

            const updatedCSV = stringify(records, { header: true });
            fs.writeFileSync(file, updatedCSV, 'utf-8');
        }
        catch (error) {
            console.error('Error processing CSV file:', error);
        }
    }

    public Read() {
        const file = path.join(this.ROOT, "database", "transactions.csv")

        try {
            if (!fs.existsSync(file)) {
                const header = [
                    "id", "creationDate", "lastModifiedDate", "name", "description", "type", "agent", "transactionDate", "referenceDate", 
                    "value", "name", "details"
                ];

                const newCSV = stringify([], { header: true });
                fs.writeFileSync(file, newCSV, 'utf-8');
            }

            
            const fileContent = fs.readFileSync(file, 'utf-8');
            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
            
            for (let i = 0; i < records.length; i++) {
                const transaction = new Transaction(
                    records[i].id,
                    parseInt(records[i].creationDate),
                    parseInt(records[i].lastModifiedDate),
                    records[i].name,
                    records[i].description,
                    records[i].type,
                    records[i].agent,
                    parseInt(records[i].transactionDate),
                    parseInt(records[i].referenceDate),
                    parseFloat(records[i].value),
                    records[i].details || "",
                )
                this._transactions.push(transaction);
                console.log(transaction)
            }

        } catch (error) {
            console.error('Error reading CSV file:', error);
        }
    }

    public Update(){
        
    }

    public Delete(){
        
    }

    public GetTransactions(): Transaction[] {
        return this._transactions;
    }
}