import { loadScriptOnce } from './util.js?v=1';
import { t } from './i18n.js?v=1';

const FILESAVER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js';

function formatDisplayLink(cLink) {
    let displayLink = cLink;
    try {
        const urlObj = new URL(cLink);
        displayLink = urlObj.hostname + (urlObj.pathname.length > 1 ? urlObj.pathname : "") + "...";
        if (displayLink.length > 45) displayLink = displayLink.substring(0, 42) + "...";
    } catch (e) {}
    return displayLink;
}

export async function downloadWord() {
    await loadScriptOnce(FILESAVER_URL);

    const tr = t();
    let html = '<html xmlns:o=\'urn:schemas-microsoft-com:office:office\' xmlns:w=\'urn:schemas-microsoft-com:office:word\'><head><meta charset="utf-8"><style>body{font-family:"Microsoft JhengHei";}table{border-collapse:collapse;width:100%;}</style></head><body>';

    const agency = document.getElementById('ipt_agency').value;
    if (agency && agency.trim() !== "") { html += '<p style="text-align:center;font-size:20pt;font-weight:bold;">' + agency + '</p>'; }
    html += '<p style="text-align:center;font-size:24pt;font-weight:bold;border-bottom:2px double #000;">' + tr.title + '</p>';

    html += '<table border="1" style="border-collapse:collapse;width:100%;">';
    html += '<tr><td style="font-weight:bold;padding:6px 10px;background:#f8f9fa;width:20%;">' + tr.client + '</td><td style="padding:6px 10px;width:30%;">' + document.getElementById('ipt_company').value + '</td><td style="font-weight:bold;padding:6px 10px;background:#f8f9fa;width:20%;">' + tr.contact + '</td><td style="padding:6px 10px;width:30%;">' + document.getElementById('ipt_contact').value + '</td></tr>';
    html += '<tr><td style="font-weight:bold;padding:6px 10px;background:#f8f9fa;">' + tr.phone + '</td><td style="padding:6px 10px;">' + document.getElementById('ipt_phone').value + '</td><td style="font-weight:bold;padding:6px 10px;background:#f8f9fa;">' + tr.date + '</td><td style="padding:6px 10px;">' + document.getElementById('ipt_date').value + '</td></tr>';
    html += '<tr><td style="font-weight:bold;padding:6px 10px;background:#f8f9fa;">' + tr.days + '</td><td style="padding:6px 10px;">' + document.getElementById('ipt_days').value + '</td><td style="font-weight:bold;padding:6px 10px;background:#f8f9fa;">' + tr.meetup + '</td><td style="padding:6px 10px;">' + document.getElementById('ipt_meetup').value + '</td></tr>';
    html += '</table><br>';

    document.querySelectorAll('.day-group').forEach(function (group) {
        html += '<table border="1" style="border-collapse:collapse;width:100%;margin-bottom:20px;"><tr style="background:#2c3e50;color:#fff;"><td colspan="2" style="padding:10px;font-weight:bold;">' + group.querySelector('.day-header').innerText + '</td></tr>';
        group.querySelectorAll('.itinerary-item').forEach(function (it) {
            let content = it.querySelector('.item-content').value.replace(/\n/g, '<br>');
            const cLink = it.querySelector('.ipt-c-link').value;
            if (cLink) {
                const displayLink = formatDisplayLink(cLink);
                content += '<p style="margin-top:2px;margin-bottom:0;"><a href="' + cLink + '" style="color:#003580;text-decoration:underline;font-size:10pt;">' + tr.word_link_prefix + ': ' + displayLink + '</a></p>';
            }
            html += '<tr><td style="width:80px;padding:10px;border:1px solid #eee;text-align:center;font-weight:bold;vertical-align:middle;">' + it.querySelector('.ipt-time').value + '</td><td style="padding:10px;border:1px solid #eee;">' + content + '</td></tr>';
        });
        const noteEl = group.querySelector('.ipt-note');
        const noteVal = noteEl ? noteEl.value.trim() : '';
        if (noteVal) {
            html += '<tr><td colspan="2" style="padding:10px;border:1px solid #eee;background:#fffbe6;"><b>' + tr.note_label + '</b><br>' + noteVal.replace(/\n/g, '<br>') + '</td></tr>';
        }
        html += '</table>';
    });

    html += '<br><p style="font-size:14pt;font-weight:bold;margin-bottom:10px;">' + tr.word_cost_title + '</p><table style="width:100%;border:1px solid #000;">';
    const costLabels = [];
    for (let i = 1; i <= 5; i++) costLabels.push(document.querySelector('[data-i18n="c' + i + '_label"]').textContent);
    for (let i = 1; i <= 5; i++) {
        const val = document.getElementById('ipt_c' + i).value;
        html += '<tr><td style="width:25%;background:#f8f9fa;border:1px solid #000;padding:5px;font-weight:bold;">' + costLabels[i - 1] + '</td><td style="width:75%;border:1px solid #000;padding:5px;">' + val + '</td></tr>';
    }
    html += '</table>';
    window.saveAs(new Blob([html], { type: 'application/msword' }), 'Itinerary.doc');
}
