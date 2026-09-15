export function autoHeight(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

export function debounce(fn, wait) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
    };
}

export function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

const scriptCache = {};
export function loadScriptOnce(url) {
    if (!scriptCache[url]) {
        scriptCache[url] = new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = url;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error('Failed to load script: ' + url));
            document.head.appendChild(s);
        });
    }
    return scriptCache[url];
}
