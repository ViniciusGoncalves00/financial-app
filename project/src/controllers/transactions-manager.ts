import * as fs from 'fs';
import { IRead } from '../interfaces/iread';
import { IUpdate } from '../interfaces/iupdate';
import { IDelete } from '../interfaces/idelete';
import { Transaction } from '../models/transaction';
import { PathManager } from '../scripts/path-manager';
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { TransactionType } from "../enums/transaction-type";
import { Details } from '../models/details';
import path from 'path';

export class TransactionsManager implements IRead, IUpdate, IDelete {
    private static _instance: TransactionsManager;
    private _transactions: Transaction[] = [];

    private ROOT: string;
    private _database: string = "database";
    private _details: string = "details";
    private _filename: string = "transactions.csv";
    private _transactionsFile: string;
    private _detailsPath: string;

    private constructor() {
        this.ROOT = PathManager.GetInstance().GetRoot();
        this._transactionsFile = path.join(this.ROOT, this._database, this._filename);
        this._detailsPath = path.join(this.ROOT, this._database, this._details);

        this.Read();
    }

    public static GetInstance(): TransactionsManager {
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
        details?: { product: string; quantity: number }[]
    ) {
        try {
            if (!fs.existsSync(this._transactionsFile)) {
                console.error('Error processing CSV file: file does not exist.');
                return;
            }
    
            const fileContent = fs.readFileSync(this._transactionsFile, 'utf-8');
            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
    
            const transactionDateTicks = new Date(date).getTime();
            const referenceDateTicks = new Date(referenceDate).getTime();
    
            let transactionType: TransactionType;
            switch (type.toLowerCase()) {
                case "entry":
                    transactionType = TransactionType.Entry;
                    break;
                case "exit":
                    transactionType = TransactionType.Exit;
                    break;
                default:
                    console.error('Invalid transaction type.');
                    return;
            }
    
            let detailsId = "";
            let detailsObj = null;
            if (details && details.length > 0) {
                detailsObj = new Details(null, details);
                detailsId = detailsObj.getInfo().id;
                const detailsFilePath = path.join(this._detailsPath, `${detailsId}.csv`);
                const detailsCSV = stringify(details, { header: true });
                fs.writeFileSync(detailsFilePath, detailsCSV, 'utf-8');
            }
    
            const transaction = new Transaction(
                name,
                description,
                transactionType,
                agent,
                transactionDateTicks,
                referenceDateTicks,
                value,
                detailsObj
            );
            
    
            this._transactions.push(transaction);
            records.push(transaction.getInfo());
    
            const updatedCSV = stringify(records, { header: true });
            fs.writeFileSync(this._transactionsFile, updatedCSV, 'utf-8');
        } catch (error) {
            console.error('Error processing CSV file:', error);
        }
    }

    public Read() {
        try {
            if (!fs.existsSync(this._transactionsFile)) {
                const newCSV = stringify([], { header: true });
                fs.writeFileSync(this._transactionsFile, newCSV, 'utf-8');
            }
    
            const fileContent = fs.readFileSync(this._transactionsFile, 'utf-8');
            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
    
            for (const record of records) {
                let detailsObj: Details | null = null;
                if (record.details) {
                    const detailsFilePath = path.join(this._detailsPath, `${record.details}.csv`);
                    if (fs.existsSync(detailsFilePath)) {
                        const detailsContent = fs.readFileSync(detailsFilePath, 'utf-8');
                        const detailsRecords = parse(detailsContent, {
                            columns: true,
                            skip_empty_lines: true
                        });
                        detailsObj = new Details(record.details, detailsRecords);
                    }
                }
    
                const transaction = new Transaction(
                    record.name,
                    record.description,
                    record.type,
                    record.agent,
                    parseInt(record.transactionDate),
                    parseInt(record.referenceDate),
                    parseFloat(record.value),
                    detailsObj,
                    record.id,
                    parseInt(record.creationDate),
                    parseInt(record.lastModifiedDate)
                );
                this._transactions.push(transaction);
            }
        } catch (error) {
            console.error('Error reading CSV file:', error);
        }
    }

    public Update() {
        // Implementar método de atualização
    }

    public Delete() {
        // Implementar método de deleção
    }

    public GetTransactions(): Transaction[] {
        return this._transactions;
    }
}
