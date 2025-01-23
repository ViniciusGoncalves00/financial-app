import * as fs from 'fs';
import { ICreate } from '../interfaces/icreate';
import { IRead } from '../interfaces/iread';
import { IUpdate } from '../interfaces/iupdate';
import { IDelete } from '../interfaces/idelete';
import { Transaction } from '../models/transaction';
import { PathManager } from './path-manager';
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync"

export class TransactionsManager implements ICreate, IRead, IUpdate, IDelete {
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
        if(this._instance !== null){
            this._instance == new TransactionsManager();
        }
        return this._instance;
    }

    public Create(transactionData: {
        name: string,
        type: string,
        agent: string,
        transactionDate: string,
        referenceDate: string,
        value: number,
        description: string,
        details?: string
        })
    {
        try {
            if (!fs.existsSync(this.ROOT)) {
                const header = [
                    "id", "type", "agent", "transactionDate", "referenceDate",
                    "value", "creationDate", "lastModified", "name", "description", "details"
                ];

                const newCSV = stringify([], { header: true });
                fs.writeFileSync(this.ROOT, newCSV, 'utf-8');
                console.log("CSV file created with header.");
            }

            const fileContent = fs.readFileSync(this.ROOT, 'utf-8');
            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            });

            const newId = records.length > 0 ? Math.max(...records.map((r: any) => parseInt(r.id))) + 1 : 1;

            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];

            // let detailsPath: string | undefined;
            // if (transactionData.details && fs.existsSync(path.join(this.ROOT, transactionData.details))) {
            //     detailsPath = transactionData.details;
            // }

            let type = TransactionType.Entry
            transactionData.type = transactionData.type.toLowerCase();
            try {
                if(transactionData.type == "entry"){
                    type = TransactionType.Entry;
                }
                else if(transactionData.type == "exit"){
                    type = TransactionType.Exit;
                }
                else{
                    console.error('Invalid transaction type.');
                }
            }
            catch (error) {
                console.error('Error processing CSV file transaction type:', error);
            }

            const transactionDate = new Date(2025, 1, 30);
            const referenceDate = new Date(2025, 1, 30);

            const transaction = new Transaction(
                newId,
                currentDate,
                currentDate,
                transactionData.name,
                transactionData.description,
                type,
                transactionData.agent,
                transactionDate,
                referenceDate,
                transactionData.value,
                transactionData.details || "",
            )
            
            this._transactions.push(transaction);
            records.push(transaction);

            const updatedCSV = stringify(records, { header: true });
            fs.writeFileSync(this.ROOT, updatedCSV, 'utf-8');
            console.log('Transaction successfully added to CSV file.');
        }
        catch (error) {
            console.error('Error processing CSV file:', error);
        }
    }

    public Read() {
        try {
            if (!fs.existsSync(this.ROOT)) {
                const header = [
                    "id", "type", "agent", "transactionDate", "referenceDate", 
                    "value", "creationDate", "lastModified", "name", "description", "details"
                ];

                const newCSV = stringify([], { header: true });
                fs.writeFileSync(this.ROOT, newCSV, 'utf-8');
                console.log("CSV file created with header.");
            }

            const fileContent = fs.readFileSync(this.ROOT, 'utf-8');
            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            });

            this._transactions = records.map((record: any) => {
                const transaction = new Transaction(
                    record.newId,
                    record.currentDate,
                    record.currentDate,
                    record.transactionData.name,
                    record.transactionData.description,
                    record.type,
                    record.transactionData.agent,
                    record.transactionDate,
                    record.referenceDate,
                    record.transactionData.value,
                    record.transactionData.details || "",
                    )
                })

            console.log('Transactions successfully read from CSV file.');
        } catch (error) {
            console.error('Error reading CSV file:', error);
        }
    }

    public Update(){
        
    }

    public Delete(){
        
    }
}