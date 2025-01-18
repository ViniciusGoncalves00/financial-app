"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const item_1 = require("./item");
class Product extends item_1.Item {
    constructor(id, creationDate, lastModified, name, description, value, unitOfMeasure, amount) {
        super(id, creationDate, lastModified, name, description, value);
        this._unitOfMeasure = unitOfMeasure;
        this._amount = amount;
    }
    Get() {
        return Object.assign(Object.assign({}, super.Get()), { unitOfMeasure: this._unitOfMeasure, amount: this._amount });
    }
}
exports.Product = Product;
//# sourceMappingURL=product.js.map