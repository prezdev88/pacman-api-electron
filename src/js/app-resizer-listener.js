adjustAppListHeight();

window.addEventListener('resize', adjustAppListHeight);
window.addEventListener('load', adjustAppListHeight);

function adjustAppListHeight() {
    const searchBar = document.getElementById('searchBar');
    const appList = document.getElementById('app-list');
    const totalOffset = searchBar.offsetHeight + searchBar.offsetTop; // Altura + espacio desde arriba
    const parentPaddingBottom = parseInt(window.getComputedStyle(appList.parentElement).paddingBottom) || 0;
    const availableHeight = window.innerHeight - totalOffset - parentPaddingBottom;
    appList.style.height = `${availableHeight - 40}px`;
}
