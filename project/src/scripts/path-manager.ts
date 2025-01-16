import path from "path";

export class PathManager{
    private static _instance: PathManager;

    private ROOT : string;
     
    private constructor(){}

    public static GetInstance() : PathManager {
        if (!this._instance) {
            this._instance = new PathManager();
        }
        return this._instance;
    }

    public Initialize(root : string): void {
        if(this.ROOT != null){
            return;
        }
        this.ROOT = root;

        const rootPath = this.ROOT;

        document.getElementById('loadContentBtn').addEventListener('click', function() {
            const filePath = path.join(rootPath, "header.html");

            fetch(filePath)
                .then(response => response.text())
                .then(data => {
                    document.getElementById('content-content').innerHTML = data;
                })
                .catch(error => {
                    console.error('Error loading the file:', error);
                });
        });
        
        console.log(this.ROOT)
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