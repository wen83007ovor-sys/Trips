import { applyLang } from './i18n.js?v=20260916000613';
import { setupFabDrag } from './fab.js?v=20260916000613';
import './events.js?v=20260916000613';

document.addEventListener('DOMContentLoaded', () => {
    applyLang();
    document.getElementById('fabMain').textContent = '✕';
    setupFabDrag();
});
