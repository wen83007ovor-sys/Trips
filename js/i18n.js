import { getLang } from './state.js?v=1';

export const i18n = {
    "zh-TW": {
        title: "旅遊行程", client: "客戶名稱：", contact: "聯絡窗口：", phone: "聯絡電話：", meetup: "集合地點：", date: "出發日期：", days: "行程天數：",
        c1_label: "個人團費", c2_label: "交通", c3_label: "餐食", c4_label: "住宿", c5_label: "費用包含",
        ph_agency: "輸入旅行社名稱", c1_ph: "$ /人", c2_ph: "交通說明: 車資/機票", c3_ph: "早午晚餐說明", c4_ph: "飯店名稱與房型", c5_ph: "門票保險等",
        btn_save: "存檔", btn_load: "讀檔", btn_gen: "1.行程", btn_view: "2.預覽", btn_back: "返回編輯", btn_pdf: "下載PDF", btn_word: "下載Word",
        click_hint: "請點擊下方「1. 行程」", day_header: "Day", note_label: "當日備註：", add_item: "+ 增加項目",
        ph_time: "00:00", ph_content: "輸入地名 (如: 大阪, 首爾)",

        // V36: 全部使用 Klook (修復版網址)
        btn_search_hotel: '🏨 找 "{city}" 住宿',
        btn_search_act: '🎡 找 "{city}" 景點',
        ph_paste_link: "在此貼上網址 (Paste Link)...",
        btn_confirm: "確認連結",
        link_saved: "預訂連結",

        msg_saved: "✅ 存檔成功", msg_loaded: "📂 讀檔成功", msg_no_record: "無存檔紀錄",
        msg_load_error: "⚠️ 讀取存檔失敗，資料可能已損毀",

        word_cost_title: "■ 費用明細",
        word_link_prefix: "預訂連結"
    },
    "en": {
        title: "Travel Itinerary", client: "Client:", contact: "Contact:", phone: "Phone:", meetup: "Meeting Point:", date: "Start Date:", days: "Days:",
        c1_label: "Fee", c2_label: "Transport", c3_label: "Meals", c4_label: "Hotel", c5_label: "Included",
        ph_agency: "Agency Name", c1_ph: "$", c2_ph: "Details", c3_ph: "Details", c4_ph: "Hotel Name", c5_ph: "Items",
        btn_save: "Save", btn_load: "Load", btn_gen: "Build", btn_view: "Preview", btn_back: "Edit", btn_pdf: "PDF", btn_word: "Word",
        click_hint: "Click 'Build' below", day_header: "Day", note_label: "Notes:", add_item: "+ Item",
        ph_time: "00:00", ph_content: "Type city (e.g. London)",

        btn_search_hotel: '🏨 Find "{city}" Hotel',
        btn_search_act: '🎡 Find "{city}" Activity',
        ph_paste_link: "Paste URL here...",
        btn_confirm: "Save Link",
        link_saved: "Booking Link",

        msg_saved: "✅ Saved Successfully", msg_loaded: "📂 Loaded Successfully", msg_no_record: "No records found",
        msg_load_error: "⚠️ Failed to load saved data",

        word_cost_title: "■ Costs",
        word_link_prefix: "Booking Link"
    }
};

export function t() {
    return i18n[getLang()];
}

export function applyLang() {
    const tr = t();
    document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.getAttribute('data-i18n'); if (tr[key]) el.textContent = tr[key]; });
    document.querySelectorAll('[data-ph]').forEach(el => { const key = el.getAttribute('data-ph'); if (tr[key]) el.placeholder = tr[key]; });
    document.querySelectorAll('.day-header').forEach(el => { if (el.dataset.day) el.innerHTML = `${tr.day_header} ${el.dataset.day} (${el.dataset.date})`; });
    document.querySelectorAll('.note-label').forEach(el => el.textContent = tr.note_label);
    document.querySelectorAll('.btn-add').forEach(el => el.textContent = tr.add_item);
    document.querySelectorAll('.ipt-time').forEach(el => el.placeholder = tr.ph_time);
    document.querySelectorAll('.item-content').forEach(el => el.placeholder = tr.ph_content);
    document.querySelectorAll('.ipt-paste-link').forEach(el => el.placeholder = tr.ph_paste_link);
    document.querySelectorAll('.btn-save-link').forEach(el => el.textContent = tr.btn_confirm);
    document.querySelectorAll('.badge-text').forEach(el => { if (el.childNodes[0]) el.childNodes[0].nodeValue = tr.link_saved; });
}
