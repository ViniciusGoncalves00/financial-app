import { Product as Items } from "../models/product";
import * as fs from "fs";
import * as path from "path";
import csvParser from "csv-parser";

export class ItemsManager {
    private static _instance: ItemsManager;

    private _items : Items[];

    private constructor(){
        this._items = [];
        const csvFilePath = path.join(__dirname, "../../../database/products.csv");
        // this.loadItemsFromCSV(csvFilePath);
    }

    public static Initialize(){
        if(this._instance !== null){
            console.log("Product Manager is already initialized.")
        }

        this._instance = new ItemsManager();
    }

    // private loadItemsFromCSV(csvFilePath: string): void {
    //     if (!fs.existsSync(csvFilePath)) {
    //         console.error(`CSV file not found: ${csvFilePath}`);
    //         return;
    //     }

    //     fs.createReadStream(csvFilePath)
    //         .pipe(csvParser())
    //         .on("data", (row: any) => {
    //             try {
    //                 const items = new Items(
    //                     parseInt(row.id, 10),
    //                     new Date(row.creationDate),
    //                     new Date(row.lastModified),
    //                     row.name,
    //                     row.description,
    //                     row.type,
    //                     row.unitOfMeasure,
    //                     parseFloat(row.amount),
    //                     parseFloat(row.value),
    //                 );
    //                 this._items.push(items);
    //             } catch (error) {
    //                 console.error("Error parsing product:", error);
    //             }
    //         })
    //         .on("end", () => {
    //             console.log("Finished loading products from CSV.");
    //         })
    //         .on("error", (error: any) => {
    //             console.error("Error reading CSV file:", error);
    //         });
    // }
}