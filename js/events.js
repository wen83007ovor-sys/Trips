import { autoHeight, debounce } from './util.js';
import { detectKeywords, saveLink, removeLink, openSearchAndInput, updateCardDisplay } from './links.js';
import { buildItinerary, addAct } from './itinerary.js';
import { saveData, loadData } from './storage.js';
import { downloadPDF } from './export-pdf.js';
import { downloadWord } from './export-word.js';
import { toggleMode, toggleFab } from './fab.js';
import { setLang } from './state.js';
import { applyLang } from './i18n.js';

const debouncedDetectKeywords = debounce(detectKeywords, 280);

const actions = {
    preview: () => toggleMode(true),
    edit: () => toggleMode(false),
    build: () => buildItinerary(),
    load: () => loadData(),
    save: () => saveData(),
    'export-word': () => downloadWord(),
    'export-pdf': () => downloadPDF(),
    'toggle-fab': () => toggleFab(),
    'save-link': (btn) => saveLink(btn),
    'delete-item': (btn) => btn.closest('.itinerary-item').remove(),
    'remove-link': (btn) => removeLink(btn),
    'add-item': (btn) => addAct(btn),
    'search': (btn) => openSearchAndInput(btn.closest('.itinerary-item'), btn.dataset.city, btn.dataset.searchType),
};

document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const handler = actions[target.dataset.action];
    if (handler) handler(target, e);
});

document.addEventListener('change', (e) => {
    const target = e.target.closest('[data-action="change-lang"]');
    if (!target) return;
    setLang(target.value);
    applyLang();
    document.querySelectorAll('.itinerary-item').forEach(item => updateCardDisplay(item));
});

document.addEventListener('input', (e) => {
    if (e.target.classList.contains('ipt-time')) {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length >= 3) e.target.value = val.slice(0, 2) + ':' + val.slice(2, 4);
    }
    if (e.target.tagName === 'TEXTAREA') {
        autoHeight(e.target);
    }
    if (e.target.classList.contains('item-content')) {
        debouncedDetectKeywords(e.target);
    }
});
