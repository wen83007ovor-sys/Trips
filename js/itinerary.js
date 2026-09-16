import { t } from './i18n.js?v=20260916000613';
import { autoHeight, escapeHtml } from './util.js?v=20260916000613';
import { updateCardDisplay } from './links.js?v=20260916000613';

export function buildItinerary(existingData = null) {
    const days = existingData ? existingData.daysCount : document.getElementById('ipt_days').value;
    const start = document.getElementById('ipt_date').value;
    const container = document.getElementById('itineraryContainer');
    container.innerHTML = '';
    let d = start ? new Date(start) : null;
    const tr = t();

    for (let i = 1; i <= days; i++) {
        let dateStr = d ? `${d.getMonth() + 1}/${d.getDate()}` : `Day ${i}`;
        if (d) d.setDate(d.getDate() + 1);
        let itemsHtml = (existingData && existingData.days[i - 1])
            ? existingData.days[i - 1].items.map(item => createItemRow(item)).join('')
            : createItemRow({});
        const noteVal = (existingData && existingData.days[i - 1]) ? (existingData.days[i - 1].note || "") : "";
        const group = document.createElement('div'); group.className = 'day-group';
        group.innerHTML = `<div class="day-header" data-day="${i}" data-date="${dateStr}">${tr.day_header} ${i} (${dateStr})</div>` +
            `<div class="items-list">${itemsHtml}</div>` +
            `<div class="add-act-wrapper"><button class="btn-add" data-action="add-item">${tr.add_item}</button></div>` +
            `<div class="note-area"><label class="note-label" for="ipt_note_${i}">${tr.note_label}</label><textarea id="ipt_note_${i}" class="ipt-note">${escapeHtml(noteVal)}</textarea></div>`;
        container.appendChild(group);
    }
    document.querySelectorAll('textarea').forEach(ta => autoHeight(ta));
    document.querySelectorAll('.itinerary-item').forEach(item => updateCardDisplay(item));
}

export function createItemRow(data) {
    const tr = t();
    const { time = "", content = "", cLink = "" } = data;
    return `<div class="itinerary-item">
        <div class="time-col">
            <input type="text" class="ipt-time" value="${escapeHtml(time)}" placeholder="${tr.ph_time}" maxlength="5">
        </div>

        <div class="content-col">
            <textarea class="item-content" placeholder="${tr.ph_content}" rows="1">${escapeHtml(content)}</textarea>

            <div class="link-input-container tools-area">
                <input type="text" class="ipt-paste-link" placeholder="${tr.ph_paste_link}">
                <button class="btn-save-link" data-action="save-link">${tr.btn_confirm}</button>
            </div>

            <div class="confirmed-link-badge"></div>
            <div class="card-editor"><input type="text" class="card-input ipt-c-link" value="${escapeHtml(cLink)}"></div>
        </div>

        <button class="btn-del-item no-print" data-action="delete-item">×</button>
    </div>`;
}

export function addAct(btn) {
    btn.closest('.day-group').querySelector('.items-list').appendChild(document.createElement('div')).outerHTML = createItemRow({});
}
