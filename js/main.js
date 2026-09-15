import { applyLang } from './i18n.js?v=1';
import { setupFabDrag } from './fab.js?v=1';
import './events.js?v=1';

document.addEventListener('DOMContentLoaded', () => {
    applyLang();
    document.getElementById('fabMain').textContent = '✕';
    setupFabDrag();
});
