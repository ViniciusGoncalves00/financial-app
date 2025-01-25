import { PathManager } from './path-manager';
import { TransactionsManager } from './transactions-manager';

export class DatabaseManager {
    private static _instance: DatabaseManager;

    private _transactionsManager: TransactionsManager | null = null;

    private ROOT : string;
    private folder : string = "";
    private filename : string = "transactions";
    private format : string = "csv";

    private constructor(){
        this.ROOT = PathManager.GetInstance().GetRoot()

        this.InitializeDatabases()
    }

    public static GetInstance() : DatabaseManager {
        if (this._instance == null) {
            this._instance = new DatabaseManager();
        }
        
        return this._instance;
    }

    private InitializeDatabases(){
        this._transactionsManager = TransactionsManager.GetInstance();
    }

    public GetTransactionManager(){
        return this._transactionsManager;
    }
}