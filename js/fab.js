import { isFabOpen, setFabOpen, setPreviewMode } from './state.js?v=1';
import { autoHeight } from './util.js?v=1';

export function toggleMode(isPreview) {
    document.body.classList.toggle('preview-mode', isPreview);
    setPreviewMode(isPreview);
    const editGrp = document.getElementById('group-edit');
    const preGrp = document.getElementById('group-preview');
    editGrp.classList.toggle('hidden', isPreview);
    preGrp.classList.toggle('hidden', !isPreview);
    // 切換後展開選單，移除 collapsed
    setFabOpen(true);
    document.getElementById('fabMain').textContent = '✕';
    editGrp.classList.remove('collapsed');
    preGrp.classList.remove('collapsed');
    document.querySelectorAll('input, textarea').forEach(el => { if (!el.classList.contains('ipt-c-link')) el.readOnly = isPreview; });
    if (isPreview) document.querySelectorAll('textarea').forEach(ta => autoHeight(ta));
}

// FAB 展開/收合
export function toggleFab() {
    setFabOpen(!isFabOpen());
    const editGrp = document.getElementById('group-edit');
    const previewGrp = document.getElementById('group-preview');
    document.getElementById('fabMain').textContent = isFabOpen() ? '✕' : '☰';
    [editGrp, previewGrp].forEach(m => {
        if (m && !m.classList.contains('hidden')) {
            m.classList.toggle('collapsed', !isFabOpen());
        }
    });
}

// 可拖曳 FAB
export function setupFabDrag() {
    const fab = document.getElementById('fabContainer');
    if (!fab) return;
    let dragging = false, startX, startY, origRight, origBottom;
    fab.addEventListener('pointerdown', function (e) {
        if (e.target.closest('button')) return;
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        const rect = fab.getBoundingClientRect();
        origRight = window.innerWidth - rect.right;
        origBottom = window.innerHeight - rect.bottom;
        fab.setPointerCapture(e.pointerId);
        e.preventDefault();
    });
    fab.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        const dx = e.clientX - startX, dy = e.clientY - startY;
        let newRight = origRight - dx;
        let newBottom = origBottom - dy;
        newRight = Math.max(8, Math.min(window.innerWidth - 70, newRight));
        newBottom = Math.max(8, Math.min(window.innerHeight - 70, newBottom));
        fab.style.right = newRight + 'px';
        fab.style.bottom = newBottom + 'px';
    });
    fab.addEventListener('pointerup', function () { dragging = false; });
}
