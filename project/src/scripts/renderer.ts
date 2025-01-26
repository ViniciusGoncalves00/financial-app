import Alpine from "alpinejs";
import "./styles/index.css";
import { DatabaseManager } from "./database-manager";
import { PathManager } from "./path-manager";

async function loadComponent(filePath: string, targetId: string): Promise<void> {
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const htmlContent = await response.text();
            document.getElementById(targetId)!.innerHTML = htmlContent;
        } else {
            console.error(`Failed to load ${filePath}:`, response.statusText);
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

declare global {
    interface Window {
        Alpine: typeof Alpine;
    }
}

window.Alpine = Alpine;

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('../views/header.html', 'header-container');

    Alpine.start();
    const pathManager = PathManager.GetInstance();
    const transactionsManager = DatabaseManager.GetInstance().GetTransactionManager()
    Alpine.store("TransactionsManager", transactionsManager);
    document.documentElement.setAttribute('data-theme', 'custom_light');
});