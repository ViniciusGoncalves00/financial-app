"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsManager = void 0;
const fs = __importStar(require("fs"));
const transaction_1 = require("../models/transaction");
const path_manager_1 = require("./path-manager");
const sync_1 = require("csv-parse/sync");
const sync_2 = require("csv-stringify/sync");
const transaction_type_1 = require("../enums/transaction-type");
const path_1 = __importDefault(require("path"));
class TransactionsManager {
    constructor() {
        this._transactions = [];
        this.folder = "";
        this.filename = "transactions";
        this.format = "csv";
        this.ROOT = path_manager_1.PathManager.GetInstance().GetRoot();
        this.Read();
    }
    static GetInstance() {
        if (this._instance == null) {
            this._instance = new TransactionsManager();
        }
        return this._instance;
    }
    Create(name, type, agent, date, referenceDate, value, description, details) {
        const file = path_1.default.join(this.ROOT, "database", "transactions.csv");
        try {
            if (!fs.existsSync(file)) {
                console.error('Error processing CSV file: file does not exists.');
            }
            const fileContent = fs.readFileSync(file, 'utf-8');
            const records = (0, sync_1.parse)(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
            const newId = records.length > 0 ? Math.max(...records.map((r) => parseInt(r.id))) + 1 : 1;
            const currentDate = new Date();
            const currentDateTicks = currentDate.getTime();
            console.log(currentDate);
            console.log(currentDate.getTime());
            console.log(date);
            const typedDate = new Date(date);
            const dateTicks = typedDate.getTime();
            console.log(typedDate);
            console.log(typedDate.getTime());
            console.log(referenceDate);
            const typedReferenceDate = new Date(referenceDate);
            const referenceDateTicks = typedReferenceDate.getTime();
            console.log(typedReferenceDate);
            console.log(typedReferenceDate.getTime());
            // let detailsPath: string | undefined;
            // if (transactionData.details && fs.existsSync(path.join(this.ROOT, transactionData.details))) {
            //     detailsPath = transactionData.details;
            // }
            let transactionType = transaction_type_1.TransactionType.Entry;
            type = type.toLowerCase();
            try {
                if (type == "entry") {
                    transactionType = transaction_type_1.TransactionType.Entry;
                }
                else if (type == "exit") {
                    transactionType = transaction_type_1.TransactionType.Exit;
                }
                else {
                    console.error('Invalid transaction type.');
                }
            }
            catch (error) {
                console.error('Error processing CSV file transaction type:', error);
            }
            const transaction = new transaction_1.Transaction(newId, currentDateTicks, currentDateTicks, name, description, transactionType, agent, dateTicks, referenceDateTicks, value, details || "");
            this._transactions.push(transaction);
            const transactionPlain = {
                id: newId,
                creationDate: currentDate,
                lastModified: currentDate,
                name: name,
                description: description,
                type: type,
                agent: agent,
                transactionDate: typedDate,
                referenceDate: typedReferenceDate,
                value: value,
                details: details || "",
            };
            records.push(transactionPlain);
            const updatedCSV = (0, sync_2.stringify)(records, { header: true });
            fs.writeFileSync(file, updatedCSV, 'utf-8');
            console.log('Transaction successfully added to CSV file.');
        }
        catch (error) {
            console.error('Error processing CSV file:', error);
        }
    }
    Read() {
        const file = path_1.default.join(this.ROOT, "database", "transactions.csv");
        try {
            if (!fs.existsSync(file)) {
                const header = [
                    "id", "creation", "lastModified", "name", "description", "type", "agent", "date", "referenceDate",
                    "value", "name", "details"
                ];
                const newCSV = (0, sync_2.stringify)([], { header: true });
                fs.writeFileSync(file, newCSV, 'utf-8');
                console.log("CSV file created with header.");
            }
            const fileContent = fs.readFileSync(file, 'utf-8');
            const records = (0, sync_1.parse)(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
            for (let i = 0; i < records.length; i++) {
                const transaction = new transaction_1.Transaction(records[i].id, records[i].creation, records[i].lastModified, records[i].name, records[i].description, records[i].type, records[i].agent, records[i].date, records[i].referenceDate, records[i].value, records[i].details || "");
                this._transactions.push(transaction);
            }
            console.log('Transactions successfully read from CSV file.');
        }
        catch (error) {
            console.error('Error reading CSV file:', error);
        }
    }
    Update() {
    }
    Delete() {
    }
    GetTransactions() {
        console.log(this._transactions);
        return this._transactions;
    }
}
exports.TransactionsManager = TransactionsManager;
//# sourceMappingURL=transactions-manager.js.map