export function showToast(msg) {
    const box = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;
    box.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2500);
}
