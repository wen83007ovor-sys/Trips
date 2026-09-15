import { applyLang } from './i18n.js';
import { setupFabDrag } from './fab.js';
import './events.js';

document.addEventListener('DOMContentLoaded', () => {
    applyLang();
    document.getElementById('fabMain').textContent = '✕';
    setupFabDrag();
});
