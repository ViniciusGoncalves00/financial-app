"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const entity_1 = require("./entity");
class Agent extends entity_1.Entity {
    constructor(id, creationDate, lastModified, name, description, value) {
        super(id, creationDate, lastModified, name, description);
    }
    Get() {
        return Object.assign({}, super.Get());
    }
}
exports.Agent = Agent;
//# sourceMappingURL=agent.js.map