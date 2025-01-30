import * as fs from 'fs';
import { ICreate } from '../interfaces/icreate';
import { IRead } from '../interfaces/iread';
import { IUpdate } from '../interfaces/iupdate';
import { IDelete } from '../interfaces/idelete';
import { Product } from '../models/product';
import { PathManager } from '../scripts/path-manager';
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import path from 'path';

export class ProductsManager implements IRead, IUpdate, IDelete {
    private static _instance: ProductsManager;
    private _products: Product[] = [];

    private ROOT: string;
    private _database: string = "database";
    private _details: string = "details";
    private _filename: string = "products.csv";
    private _productsFile: string;
    private _detailsPath: string;

    private constructor() {
        this.ROOT = PathManager.GetInstance().GetRoot();
        this._productsFile = path.join(this.ROOT, this._database, this._filename);
        this._detailsPath = path.join(this.ROOT, this._database, this._details);
        this.Read();
    }

    public static GetInstance(): ProductsManager {
        if (!this._instance) {
            this._instance = new ProductsManager();
        }
        return this._instance;
    }

    public Create(
        name: string,
        description: string,
        value: number,
        unitOfMeasure: string,
        amount: number
    ) {
        try {
            if (!fs.existsSync(this._productsFile)) {
                console.error('Error processing CSV file: file does not exist.');
                return;
            }

            const fileContent = fs.readFileSync(this._productsFile, 'utf-8');
            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            });

            // Converter a unidade de medida
            let parsedUnit: UnitOfMeasure;
            try {
                parsedUnit = UnitOfMeasure[unitOfMeasure as keyof typeof UnitOfMeasure];
                if (!parsedUnit) {
                    console.error('Invalid unit of measure.');
                    return;
                }
            } catch (error) {
                console.error('Error processing unit of measure:', error);
                return;
            }

            const product = new Product(
                name,
                description,
                value,
                parsedUnit,
                amount
            );

            const productPlain = {
                id: product.getInfo().id,
                creationDate: product.getInfo().creationDate,
                lastModifiedDate: product.getInfo().lastModified,
                name: name,
                description: description,
                value: value,
                unitOfMeasure: unitOfMeasure,
                amount: amount,
            };

            this._products.push(product);
            records.push(productPlain);

            const updatedCSV = stringify(records, { header: true });
            fs.writeFileSync(this._productsFile, updatedCSV, 'utf-8');
        } catch (error) {
            console.error('Error processing CSV file:', error);
        }
    }

    public Read() {
        try {
            if (!fs.existsSync(this._productsFile)) {
                const header = [
                    "id", "creationDate", "lastModifiedDate", "name", "description", "value", "unitOfMeasure", "amount"
                ];

                const newCSV = stringify([], { header: true });
                fs.writeFileSync(this._productsFile, newCSV, 'utf-8');
            }

            const fileContent = fs.readFileSync(this._productsFile, 'utf-8');
            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            });

            for (const record of records) {
                const product = new Product(
                    record.name,
                    record.description,
                    parseFloat(record.value),
                    record.unitOfMeasure as UnitOfMeasure,
                    parseFloat(record.amount),
                    record.id,
                    parseInt(record.creationDate),
                    parseInt(record.lastModifiedDate)
                );
                this._products.push(product);
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

    public GetProducts(): Product[] {
        return this._products;
    }
}