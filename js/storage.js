import { STORAGE_KEY, CURRENT_SCHEMA_VERSION } from './config.js?v=1';
import { getLang, setLang } from './state.js?v=1';
import { i18n, applyLang } from './i18n.js?v=1';
import { showToast } from './toast.js?v=1';
import { buildItinerary } from './itinerary.js?v=1';

const LEGACY_KEY_PATTERN = /^trip_v(\d+)_data$/;

function safeParse(str) {
    if (!str) return null;
    try { return JSON.parse(str); } catch (e) { console.error('Corrupt saved data', e); return null; }
}

// 掃描 localStorage，找出編號最大的舊版 trip_vNN_data key（若存在）
function findLegacyKey() {
    let bestKey = null, bestNum = -1;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const m = key && key.match(LEGACY_KEY_PATTERN);
        if (m) {
            const num = parseInt(m[1], 10);
            if (num > bestNum) { bestNum = num; bestKey = key; }
        }
    }
    return bestKey;
}

// 把舊版（無信封、無 note 欄位）的原始物件轉換成目前的 schema
function migrateFromLegacyShape(legacy) {
    return {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        savedAt: null,
        trip: {
            lang: legacy.lang, agency: legacy.agency, company: legacy.company,
            contact: legacy.contact, phone: legacy.phone, meetup: legacy.meetup,
            date: legacy.date, daysCount: legacy.daysCount, costs: legacy.costs,
            days: (legacy.days || []).map(day => ({ note: day.note || "", items: day.items || [] }))
        }
    };
}

// 之後升級 schemaVersion 時，於此加入對應的轉換函式，例如：
// const migrations = { 2: (envelope) => ({ ...envelope, schemaVersion: 3, ... }) };
const migrations = {};

function migrateData(storedValue) {
    let envelope = storedValue;
    let migratedFromLegacy = false;

    if (!envelope) {
        const legacyKey = findLegacyKey();
        if (!legacyKey) return null; // 全新使用者，沒有任何存檔
        const legacyRaw = safeParse(localStorage.getItem(legacyKey));
        if (!legacyRaw) return null;
        envelope = migrateFromLegacyShape(legacyRaw);
        migratedFromLegacy = true;
    }

    let version = envelope.schemaVersion || 1;
    while (version < CURRENT_SCHEMA_VERSION) {
        const step = migrations[version];
        envelope = step ? step(envelope) : { ...envelope, schemaVersion: CURRENT_SCHEMA_VERSION };
        version = envelope.schemaVersion || (version + 1);
    }
    envelope.schemaVersion = CURRENT_SCHEMA_VERSION;

    if (migratedFromLegacy) {
        // 只遷移一次：立刻寫回新的固定 key，之後直接從這裡讀取
        localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    }
    return envelope;
}

function byId(id) { return document.getElementById(id); }

export function saveData() {
    const days = [];
    document.querySelectorAll('.day-group').forEach(group => {
        const items = [];
        group.querySelectorAll('.itinerary-item').forEach(it => {
            items.push({
                time: it.querySelector('.ipt-time').value, content: it.querySelector('.item-content').value,
                cLink: it.querySelector('.ipt-c-link').value
            });
        });
        const noteEl = group.querySelector('.ipt-note');
        days.push({ items, note: noteEl ? noteEl.value : "" });
    });

    const trip = {
        lang: getLang(),
        agency: byId('ipt_agency').value, company: byId('ipt_company').value,
        contact: byId('ipt_contact').value, phone: byId('ipt_phone').value,
        meetup: byId('ipt_meetup').value,
        date: byId('ipt_date').value, daysCount: byId('ipt_days').value,
        costs: [1, 2, 3, 4, 5].map(i => byId('ipt_c' + i).value), days
    };
    const envelope = { schemaVersion: CURRENT_SCHEMA_VERSION, savedAt: new Date().toISOString(), trip };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    showToast(i18n[getLang()].msg_saved);
}

export function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    let stored = null, corrupted = false;
    if (raw) {
        stored = safeParse(raw);
        if (stored === null) corrupted = true;
    }

    const envelope = migrateData(stored);
    if (!envelope || !envelope.trip) {
        if (corrupted) {
            showToast(i18n[getLang()].msg_load_error);
        } else {
            alert(i18n[getLang()].msg_no_record);
        }
        return;
    }

    const data = envelope.trip;
    if (data.lang) { setLang(data.lang); byId('langSelect').value = data.lang; applyLang(); }
    byId('ipt_agency').value = data.agency || ""; byId('ipt_company').value = data.company || "";
    byId('ipt_contact').value = data.contact || ""; byId('ipt_phone').value = data.phone || "";
    if (byId('ipt_meetup')) byId('ipt_meetup').value = data.meetup || "";
    byId('ipt_date').value = data.date || ""; byId('ipt_days').value = data.daysCount || 3;
    (data.costs || []).forEach((v, i) => { if (byId('ipt_c' + (i + 1))) byId('ipt_c' + (i + 1)).value = v; });
    buildItinerary({ daysCount: data.daysCount, days: data.days });
    showToast(i18n[getLang()].msg_loaded);
}
