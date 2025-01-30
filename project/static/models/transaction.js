"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const entity_1 = require("./entity");
class Transaction extends entity_1.Entity {
    constructor(name, description, type, agent, transactionDate, referenceDate, value, details, id, creationDate, lastModified) {
        super(name, description, id, creationDate, lastModified);
        this._type = type;
        this._agent = agent;
        this._transactionDate = transactionDate;
        this._referenceDate = referenceDate;
        this._value = value;
        this._details = details;
    }
    getInfo() {
        return Object.assign(Object.assign({}, super.getInfo()), { type: this._type, agent: this._agent, transactionDate: this._transactionDate, referenceDate: this._referenceDate, value: this._value, details: this._details });
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.js.map