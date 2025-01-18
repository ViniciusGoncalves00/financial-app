"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = void 0;
class DatabaseManager {
    constructor() {
        // const csvFilePath = path.join(__dirname, "../../../database/products.csv");
        // this.loadItemsFromCSV(csvFilePath);
    }
    static GetInstance() {
        if (this._instance !== null) {
            this._instance == new DatabaseManager();
        }
        return this._instance;
    }
    Create() {
    }
    Read() {
    }
    Update() {
    }
    Delete() {
    }
}
exports.DatabaseManager = DatabaseManager;
//# sourceMappingURL=database-manager.js.map