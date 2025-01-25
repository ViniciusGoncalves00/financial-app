"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const item_1 = require("./item");
class Service extends item_1.Item {
    constructor(id, creationDate, lastModified, name, description, value, unitOfMeasure, amount) {
        super(id, creationDate, lastModified, name, description, value);
        this._unitOfMeasure = unitOfMeasure;
        this._amount = amount;
    }
    GetInfo() {
        return Object.assign(Object.assign({}, super.GetInfo()), { unitOfMeasure: this._unitOfMeasure, amount: this._amount });
    }
}
exports.Service = Service;
//# sourceMappingURL=service.js.map