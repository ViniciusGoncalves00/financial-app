// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import 'alpinejs';
import Alpine from "alpinejs";

declare global {
    interface Window {
        Alpine: typeof Alpine;
    }
}

window.Alpine = Alpine;

document.addEventListener("DOMContentLoaded", () => {
    Alpine.start();

    document.documentElement.setAttribute('data-theme', 'custom_light');

    // if (localStorage.getItem('theme') === 'custom_light')
    // {
    //     document.documentElement.setAttribute('data-theme', 'custom_light');
    // }
    // else
    // {
    //     document.documentElement.setAttribute('data-theme', 'custom_dark');
    // }
});