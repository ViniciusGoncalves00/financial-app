"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const entity_1 = require("./entity");
class Item extends entity_1.Entity {
    constructor(id, creationDate, lastModified, name, description, value) {
        super(id, creationDate, lastModified, name, description);
        this._value = [];
        this._value.push(value);
    }
    GetInfo() {
        return Object.assign(Object.assign({}, super.GetInfo()), { value: this._value });
    }
}
exports.Item = Item;
//# sourceMappingURL=item.js.map