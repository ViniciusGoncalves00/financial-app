"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = void 0;
const path_manager_1 = require("./path-manager");
const transactions_manager_1 = require("./transactions-manager");
class DatabaseManager {
    constructor() {
        this._transactionsManager = null;
        this.folder = "";
        this.filename = "transactions";
        this.format = "csv";
        this.ROOT = path_manager_1.PathManager.GetInstance().GetRoot();
        this.InitializeDatabases();
    }
    static GetInstance() {
        if (this._instance == null) {
            this._instance = new DatabaseManager();
        }
        return this._instance;
    }
    InitializeDatabases() {
        this._transactionsManager = transactions_manager_1.TransactionsManager.GetInstance();
    }
    GetTransactionManager() {
        return this._transactionsManager;
    }
}
exports.DatabaseManager = DatabaseManager;
//# sourceMappingURL=database-manager.js.map