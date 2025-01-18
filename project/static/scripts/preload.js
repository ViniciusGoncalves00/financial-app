"use strict";
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("alpinejs");
const alpinejs_1 = __importDefault(require("alpinejs"));
window.Alpine = alpinejs_1.default;
document.addEventListener("DOMContentLoaded", () => {
    alpinejs_1.default.start();
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
//# sourceMappingURL=preload.js.map