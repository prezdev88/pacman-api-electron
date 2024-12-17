// Ajustar el scroll al cargar y al redimensionar
adjustAppListHeight();

window.addEventListener('resize', adjustAppListHeight);
window.addEventListener('load', adjustAppListHeight);

function adjustAppListHeight() {
    const searchBar = document.getElementById('searchBar');
    const appList = document.getElementById('app-list');
    const totalOffset = searchBar.offsetHeight + searchBar.offsetTop; // Altura + espacio desde arriba

    // Resta cualquier margen o padding del contenedor padre
    const parentPaddingBottom = parseInt(window.getComputedStyle(appList.parentElement).paddingBottom) || 0;

    // Calcular la altura restante de la ventana
    const availableHeight = window.innerHeight - totalOffset - parentPaddingBottom;

    appList.style.height = `${availableHeight - 30}px`;
}
