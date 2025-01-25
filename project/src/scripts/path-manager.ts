import path from "path";

export class PathManager{
    private static _instance: PathManager;

    private ROOT : string;
     
    private constructor(){
        this.ROOT = path.resolve(__dirname, '..', '..', '..');
        console.log(this.ROOT)
    }

    public static GetInstance() : PathManager {
        if (this._instance == null) {
            this._instance = new PathManager();
        }
        return this._instance;
    }

    public GetRoot(): string {
        return this.ROOT;
    }

    public Create(): void {
        
    }

    public Read(): void {
        
    }

    public Update(): void {
        
    }

    public Delete(): void {
        
    }
}