function showMessage(type, message) {
    const container = document.getElementById('message-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show fade-in`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" aria-label="Close"></button>
    `;
    container.appendChild(alert);

    alert.querySelector('.btn-close').addEventListener('click', () => {
        alert.classList.remove('fade-in');
        alert.classList.add('fade-out');
        alert.addEventListener('animationend', () => alert.remove());
    });

    setTimeout(() => {
        alert.classList.remove('fade-in');
        alert.classList.add('fade-out');
        alert.addEventListener('animationend', () => alert.remove());
    }, 5000);
}