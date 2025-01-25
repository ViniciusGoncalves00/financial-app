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
        date: Date,
        referenceDate: Date,
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

            let currentDate = new Date();

            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const day = currentDate.getDate();

            currentDate = new Date(year, month, day);
            const formattedcurrentDate = currentDate.toISOString().split('T')[0];

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
                currentDate,
                currentDate,
                name,
                description,
                transactionType,
                agent,
                date,
                referenceDate,
                value,
                details || "",
            )
            
            this._transactions.push(transaction);

            const transactionPlain = {
                id: newId,
                creationDate: formattedcurrentDate,
                lastModified: formattedcurrentDate,
                name: name,
                description: description,
                type: type,
                agent: agent,
                transactionDate: date,
                referenceDate: referenceDate,
                value: value,
                details: details || "",
            };

            records.push(transactionPlain);

            const updatedCSV = stringify(records, { header: true });
            fs.writeFileSync(file, updatedCSV, 'utf-8');
            console.log('Transaction successfully added to CSV file.');
        }
        catch (error) {
            console.error('Error processing CSV file:', error);
        }
    }

    public Read() {
        const file = path.join(this.ROOT, "database", "transactions.csv")
        console.log(file)

        try {
            if (!fs.existsSync(file)) {
                const header = [
                    "id", "creation", "lastModified", "name", "description", "type", "agent", "date", "referenceDate", 
                    "value", "name", "details"
                ];

                const newCSV = stringify([], { header: true });
                fs.writeFileSync(file, newCSV, 'utf-8');
                console.log("CSV file created with header.");
            }

            
            const fileContent = fs.readFileSync(file, 'utf-8');
            console.log(fileContent)
            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
            
            for (let i = 0; i < records.length; i++) {
                const transaction = new Transaction(
                    records[i].id,
                    records[i].creation,
                    records[i].lastModified,
                    records[i].name,
                    records[i].description,
                    records[i].type,
                    records[i].agent,
                    records[i].date,
                    records[i].referenceDate,
                    records[i].value,
                    records[i].details || "",
                )
                this._transactions.push(transaction);
            }


            console.log('Transactions successfully read from CSV file.');
        } catch (error) {
            console.error('Error reading CSV file:', error);
        }
    }

    public Update(){
        
    }

    public Delete(){
        
    }

    public GetTransactions(): Transaction[] {
        console.log(this._transactions)
        return this._transactions;
    }
}