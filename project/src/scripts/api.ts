import Alpine from "alpinejs";
import { DatabaseManager } from "./database-manager";

function init_state() {
    Alpine.store("TransactionsManager", DatabaseManager.GetInstance().GetTransactionManager());
}

document.addEventListener("alpine:init", () => {
    init_state();
});