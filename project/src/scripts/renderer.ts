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

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('../views/header.html', 'header-container');
});