import { t } from './i18n.js?v=20260916000613';
import { getLang } from './state.js?v=20260916000613';
import { AFFILIATE_CONFIG } from './config.js?v=20260916000613';
import { escapeHtml } from './util.js?v=20260916000613';

export function detectKeywords(textarea) {
    const val = textarea.value.trim();
    const parent = textarea.closest('.itinerary-item');

    if (parent.querySelector('.ipt-c-link').value) {
        const existingArea = parent.querySelector('.smart-suggestion-area');
        if (existingArea) existingArea.innerHTML = '';
        return;
    }

    let suggestArea = parent.querySelector('.smart-suggestion-area');
    if (!suggestArea) {
        suggestArea = document.createElement('div');
        suggestArea.className = 'smart-suggestion-area tools-area no-print';
        parent.querySelector('.content-col').appendChild(suggestArea);
    }
    suggestArea.innerHTML = '';
    const tr = t();
    const possibleCity = val.split(/[\s,，、]+/).pop();

    if (possibleCity && possibleCity.length > 1) {
        const hotelLabel = tr.btn_search_hotel.replace('{city}', escapeHtml(possibleCity));
        const actLabel = tr.btn_search_act.replace('{city}', escapeHtml(possibleCity));
        const cityAttr = escapeHtml(possibleCity);
        suggestArea.innerHTML =
            `<div class="suggestion-btn" data-action="search" data-search-type="booking" data-city="${cityAttr}">${hotelLabel}</div>` +
            `<div class="suggestion-btn" data-action="search" data-search-type="klook" data-city="${cityAttr}">${actLabel}</div>`;
    }
}

// 🔥 V36: 修正 Klook 住宿搜尋連結 (使用全站搜尋 + "飯店" 關鍵字)
export function openSearchAndInput(itemRow, city, type) {
    const marker = AFFILIATE_CONFIG.marker;
    const trs = AFFILIATE_CONFIG.trs;
    let targetUrl = "";

    if (type === 'booking') {
        // Klook Hotels (Global Search trick: "City + Hotel") -> Robust & works!
        const searchKeyword = city + (getLang() === 'zh-TW' ? ' 飯店' : ' Hotel');
        const u = `https://www.klook.com/search?query=${encodeURIComponent(searchKeyword)}`;
        targetUrl = `https://tp.media/r?marker=${marker}&trs=${trs}&p=4110&u=${encodeURIComponent(u)}`;
    } else {
        // Klook Activities (Standard search)
        const u = `https://www.klook.com/search?query=${encodeURIComponent(city)}`;
        targetUrl = `https://tp.media/r?marker=${marker}&trs=${trs}&p=4110&u=${encodeURIComponent(u)}`;
    }

    window.open(targetUrl, '_blank');

    const inputContainer = itemRow.querySelector('.link-input-container');
    inputContainer.style.display = 'flex';
    itemRow.querySelector('.ipt-paste-link').focus();

    const area = itemRow.querySelector('.smart-suggestion-area');
    if (area) area.innerHTML = '';
}

export function saveLink(btn) {
    const parent = btn.closest('.itinerary-item');
    const link = parent.querySelector('.ipt-paste-link').value;
    if (!link) return alert("Please paste a link");
    parent.querySelector('.ipt-c-link').value = link;
    updateCardDisplay(parent);
}

export function removeLink(btn) {
    const parent = btn.closest('.itinerary-item');
    parent.querySelector('.ipt-c-link').value = "";
    parent.querySelector('.ipt-paste-link').value = "";
    updateCardDisplay(parent);
    detectKeywords(parent.querySelector('.item-content'));
}

export function updateCardDisplay(itemRow) {
    const link = itemRow.querySelector('.ipt-c-link').value;
    const inputContainer = itemRow.querySelector('.link-input-container');
    const badge = itemRow.querySelector('.confirmed-link-badge');
    const tr = t();

    if (link) {
        inputContainer.style.display = 'none';
        badge.style.display = 'inline-flex';
        badge.innerHTML = `<span class="badge-text">${tr.link_saved}</span>: <a href="${escapeHtml(link)}" target="_blank" class="badge-url">${escapeHtml(link)}</a> <button class="btn-del-link" data-action="remove-link">×</button>`;
    } else {
        badge.style.display = 'none';
        if (itemRow.querySelector('.ipt-paste-link').value === "") {
            inputContainer.style.display = 'none';
        }
    }
}
