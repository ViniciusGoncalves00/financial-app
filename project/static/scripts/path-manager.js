"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathManager = void 0;
const path_1 = __importDefault(require("path"));
class PathManager {
    constructor() { }
    static GetInstance() {
        if (!this._instance) {
            this._instance = new PathManager();
        }
        return this._instance;
    }
    Initialize(root) {
        if (this.ROOT != null) {
            return;
        }
        this.ROOT = root;
        const rootPath = this.ROOT;
        document.getElementById('loadContentBtn').addEventListener('click', function () {
            const filePath = path_1.default.join(rootPath, "header.html");
            fetch(filePath)
                .then(response => response.text())
                .then(data => {
                document.getElementById('content-content').innerHTML = data;
            })
                .catch(error => {
                console.error('Error loading the file:', error);
            });
        });
        console.log(this.ROOT);
    }
    GetRoot() {
        return this.ROOT;
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
exports.PathManager = PathManager;
//# sourceMappingURL=path-manager.js.map