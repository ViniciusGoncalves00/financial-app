export class DatabaseManager{
    private static _instance: DatabaseManager;

    private constructor(){
        // const csvFilePath = path.join(__dirname, "../../../database/products.csv");
        // this.loadItemsFromCSV(csvFilePath);
    }

    public static GetInstance() : DatabaseManager {
        if(this._instance !== null){
            this._instance == new DatabaseManager();
        }
        return this._instance;
    }

    public Create(){

    }

    public Read(){
        
    }

    public Update(){
        
    }

    public Delete(){
        
    }
}