"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const nanoid_1 = require("nanoid");
class Entity {
    constructor(name, description, id = null, creationDate = Date.now(), lastModified = Date.now()) {
        this._id = id !== null && id !== void 0 ? id : (0, nanoid_1.nanoid)();
        this._creationDate = creationDate;
        this._lastModified = lastModified;
        this._name = name;
        this._description = description;
    }
    getInfo() {
        return {
            id: this._id,
            creationDate: this._creationDate,
            lastModified: this._lastModified,
            name: this._name,
            description: this._description
        };
    }
}
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map