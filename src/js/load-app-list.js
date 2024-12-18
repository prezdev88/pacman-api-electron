function renderAppList(packages) {
    const appListContainer = document.getElementById('app-list');

    // Generar el contenido HTML
    appListContainer.innerHTML = packages.map(app => `
        <div class="p-2 nowrap ${app.installed ? 'installed' : 'not-installed'}" data-name="${app.name}" data-installed="${app.installed}">
            <span class='${app.installed ? 'installed-app-icon' : 'not-installed-app-icon'}'>
                ${app.installed ? '●' : '○'}
            </span> 
            ${app.name} <span class='${app.source == 'aur' ? 'aur-source': 'source'}'>(${app.source})</span>
        </div>
    `).join('');

    // Seleccionar todos los elementos de la lista
    const appList = Array.from(appListContainer.children);

    appList.forEach((item, index) => {
        // Agregar el evento 'click' a cada elemento
        item.addEventListener('click', () => {
            appList.forEach(i => i.classList.remove('selected'));

            // Agregar la clase 'selected' al elemento clickeado
            item.classList.add('selected');

            // Cargar los detalles de la app seleccionada
            loadAppDetails(item.dataset.name, item.dataset.installed);
        });

        // Seleccionar la primera app por defecto
        if (index === 0) {
            item.classList.add('selected');
            // Uncomment if you want to load details of the first app by default
            loadAppDetails(item.dataset.name, item.dataset.installed);
        }
    });
}
