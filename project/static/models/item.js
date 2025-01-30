"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const entity_1 = require("./entity");
class Item extends entity_1.Entity {
    constructor(name, description, value, id, creationDate, lastModified) {
        super(name, description, id, creationDate, lastModified);
        this._value = [value];
    }
    getInfo() {
        return Object.assign(Object.assign({}, super.getInfo()), { value: this._value });
    }
}
exports.Item = Item;
//# sourceMappingURL=item.js.map