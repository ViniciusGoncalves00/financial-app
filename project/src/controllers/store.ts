import Alpine from "alpinejs";
import { DatabaseManager } from "./database-manager";
import { Formatter } from "../scripts/formatter";

declare global {
    interface Window {
        Alpine: typeof Alpine;
    }
}

window.Alpine = Alpine;

document.addEventListener("DOMContentLoaded", () => {
    Alpine.start();
});

document.addEventListener("alpine:init", () => {
    initialize_stores();
});

function initialize_stores() {
    Alpine.store("TransactionsManager", DatabaseManager.GetInstance().GetTransactionManager());
    Alpine.store("Formatter", Formatter);
}