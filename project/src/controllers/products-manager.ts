import * as fs from 'fs';
import { ICreate } from '../interfaces/icreate';
import { IRead } from '../interfaces/iread';
import { IUpdate } from '../interfaces/iupdate';
import { IDelete } from '../interfaces/idelete';
import { Product } from '../models/product';
import { PathManager } from '../scripts/path-manager';
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { TransactionType } from "../enums/transaction-type";
import path from 'path';

export class ProductsManager implements ICreate, IRead, IUpdate, IDelete {
    private static _instance: ProductsManager;

    private _products: Product[] = [];

    private ROOT : string;
    private _database : string = "database";
    private _details : string = "details";
    private _filename : string = "transactions.csv";
    private _transactionsFile : string;
    private _details_path : string;

    private constructor(){
        this.ROOT = PathManager.GetInstance().GetRoot();
        this._transactionsFile = path.join(this.ROOT, this._database, this._filename)
        this._details_path = path.join(this.ROOT, this._database, this._details)

        this.Read();
    }

    public static GetInstance() : ProductsManager {
        if (this._instance == null) {
            this._instance = new ProductsManager();
        }
        return this._instance;
    }

    public Create(data : [])
    {
        try {
            if (!fs.existsSync(this._transactionsFile)) {
                console.error('Error processing CSV file: file does not exists.');
            }

            const fileContent = fs.readFileSync(this._transactionsFile, 'utf-8');
            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            });



            const newId = records.length > 0 ? Math.max(...records.map((r: any) => parseInt(r.id))) + 1 : 1;

            const currentDateTicks = new Date().getTime();
            const transactionDateTicks = new Date(date).getTime();
            const referenceDateTicks = new Date(referenceDate).getTime();

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

            const product = new Product(
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

            const productPlain = {
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

            this._products.push(product);
            records.push(productPlain);

            const updatedCSV = stringify(records, { header: true });
            fs.writeFileSync(this._transactionsFile, updatedCSV, 'utf-8');
        }
        catch (error) {
            console.error('Error processing CSV file:', error);
        }
    }

    public Read() {
        try {
            if (!fs.existsSync(this._transactionsFile)) {
                const header = [
                    "id", "creationDate", "lastModifiedDate", "name", "description", "type", "agent", "transactionDate", "referenceDate", 
                    "value", "name", "details"
                ];

                const newCSV = stringify([], { header: true });
                fs.writeFileSync(this._transactionsFile, newCSV, 'utf-8');
            }

            
            const fileContent = fs.readFileSync(this._transactionsFile, 'utf-8');
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
                this._products.push(transaction);
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
        return this._products;
    }
}