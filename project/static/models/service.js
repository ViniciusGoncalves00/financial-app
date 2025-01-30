"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const item_1 = require("./item");
class Service extends item_1.Item {
    constructor(name, description, value, unitOfMeasure, amount, id, creationDate, lastModified) {
        super(name, description, value, id, creationDate, lastModified);
        this._unitOfMeasure = unitOfMeasure;
        this._amount = amount;
    }
    getInfo() {
        return Object.assign(Object.assign({}, super.getInfo()), { unitOfMeasure: this._unitOfMeasure, amount: this._amount });
    }
}
exports.Service = Service;
//# sourceMappingURL=service.js.map