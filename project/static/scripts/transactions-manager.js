"use strict";
// import * as fs from 'fs';
// import { ICreatable } from '../interfaces/icreatable';
// import { IDeletable } from '../interfaces/ideletable';
// import { IReadable } from '../interfaces/ireadable';
// import { IUpdatable } from '../interfaces/iupdatable';
// import * as csv from 'csv-parser';
// import { Transaction } from '../models/transaction';
// export class DatabaseManager implements ICreatable, IDeletable, IReadable, IUpdatable {
//     private static _instance: DatabaseManager;
//     private constructor(){
//         // const csvFilePath = path.join(__dirname, "../../../database/products.csv");
//         // this.loadItemsFromCSV(csvFilePath);
//     }
//     public static GetInstance() : DatabaseManager {
//         if(this._instance !== null){
//             this._instance == new DatabaseManager();
//         }
//         return this._instance;
//     }
//     public Create(transaction: Transaction){
//         const data = [
//             this.id,
//             this._type,
//             this._agent,
//             this._transactionDate.toISOString(),
//             this._referenceDate.toISOString(),
//             this._value,
//             this.creationDate.toISOString(),
//             this.lastModified.toISOString(),
//             this.name,
//             this.description
//         ];
//         return data.join(',');
//     }
//     public Read(){
//     }
//     public Update(){
//     }
//     public Delete(){
//     }
// }
// public toCSV(): string {
//     const data = [
//         this.id,
//         this._type,
//         this._agent,
//         this._transactionDate.toISOString(),
//         this._referenceDate.toISOString(),
//         this._value,
//         this.creationDate.toISOString(),
//         this.lastModified.toISOString(),
//         this.name,
//         this.description
//     ];
//     return data.join(',');
// }
// public static csvHeader(): string {
//     return 'ID,Type,Agent,TransactionDate,ReferenceDate,Value,CreationDate,LastModified,Name,Description';
// }
// // interface DataObject {
// //     name: string;
// //     age: number;
// //     city: string;
// // }
// // function saveToCSVManual(filePath: string, data: DataObject[]): void {
// // }
// // const data: DataObject[] = [
// //     { name: 'Alice', age: 30, city: 'New York' },
// //     { name: 'Bob', age: 25, city: 'Los Angeles' },
// //     { name: 'Charlie', age: 35, city: 'Chicago' }
// // ];
// // const filePath = 'output.csv';
// // saveToCSVManual(filePath, data);
//# sourceMappingURL=transactions-manager.js.map