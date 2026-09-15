import { loadScriptOnce, autoHeight } from './util.js';

const HTML2PDF_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';

export async function downloadPDF() {
    await loadScriptOnce(HTML2PDF_URL);

    const element = document.getElementById('pdfArea');
    const originalScrollY = window.scrollY; window.scrollTo(0, 0);
    element.classList.add('pdf-render-fix');

    const agencyInput = document.getElementById('ipt_agency');
    const originalPlaceholder = agencyInput.placeholder;
    if (!agencyInput.value.trim()) { agencyInput.placeholder = ""; agencyInput.style.borderBottom = "none"; }

    const links = document.querySelectorAll('.confirmed-link-badge .badge-url');
    const originalTexts = [];
    links.forEach((a, index) => {
        originalTexts[index] = a.textContent;
        let displayLink = a.href;
        try {
            const urlObj = new URL(a.href);
            displayLink = urlObj.hostname + (urlObj.pathname.length > 1 ? urlObj.pathname : "") + "...";
            if (displayLink.length > 45) displayLink = displayLink.substring(0, 42) + "...";
        } catch (e) {}
        a.textContent = displayLink;
    });

    document.querySelectorAll('textarea').forEach(ta => autoHeight(ta));

    setTimeout(() => {
        window.html2pdf().set({ margin: 0, filename: `Itinerary.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true, width: 800 }, jsPDF: { unit: 'pt', format: 'a4' } }).from(element).save()
        .then(() => {
            element.classList.remove('pdf-render-fix');
            if (!agencyInput.value.trim()) { agencyInput.placeholder = originalPlaceholder; agencyInput.style.borderBottom = ""; }
            links.forEach((a, index) => { a.textContent = originalTexts[index]; });
            document.querySelectorAll('textarea').forEach(ta => autoHeight(ta)); window.scrollTo(0, originalScrollY);
        });
    }, 100);
}
