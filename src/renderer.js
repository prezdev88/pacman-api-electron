const axios = require('axios');
const { ipcRenderer } = require('electron');
const log = require('electron-log');

let apps = [];
let filteredApps = [];
let currentFilter = "All";

// Llama a la función al final de la carga de datos
loadData().then(() => {
    selectFirstApp();
});

async function loadData() {
    try {
        const nativeResponse = await axios.get('http://localhost:8080/api/v1/native/packages/installed/explicit/lite');
        const aurResponse = await axios.get('http://localhost:8080/api/v1/foreign/packages/installed/explicit/lite');

        const nativeApps = nativeResponse.data.packages.map(app => ({ ...app, source: "Native" }));
        const aurApps = aurResponse.data.packages.map(app => ({ ...app, source: "AUR" }));

        apps = [...nativeApps, ...aurApps];
        apps.sort((a, b) => a.name.localeCompare(b.name));
        filterApps();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function filterApps(query = "") {
    filteredApps = apps.filter(app => {
        const matchesQuery = app.name.toLowerCase().includes(query.toLowerCase());
        const matchesFilter = currentFilter === "All" || app.source === currentFilter;
        return matchesQuery && matchesFilter;
    });

    updateAppList();
}

function updateAppList() {
    const appList = document.getElementById('app-list');
    appList.innerHTML = filteredApps.map(app => `
        <div class="p-2" data-name="${app.name}">
            ${app.name}<span class='aur'>${app.source === "AUR" ? "  (AUR)" : ""}</span>
        </div>
    `).join('');

    const appItems = document.querySelectorAll('#app-list > div');
    appItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Quitar la clase 'selected' de todos los elementos
            appItems.forEach(i => i.classList.remove('selected'));

            // Agregar la clase 'selected' al elemento clickeado
            item.classList.add('selected');

            // Cargar los detalles de la app seleccionada
            loadAppDetails(item.dataset.name);
        });

        // Seleccionar la primera app por defecto
        if (index === 0) {
            item.classList.add('selected');
            loadAppDetails(item.dataset.name);
        }
    });
}

async function loadAppDetails(name) {
    const app = apps.find(app => app.name === name);
    if (!app) return;

    const endpoint = app.source === "Native"
        ? `http://localhost:8080/api/v1/native/packages/${name}`
        : `http://localhost:8080/api/v1/foreign/packages/${name}`;

    try {
        const response = await axios.get(endpoint);
        const details = response.data.package;

        document.getElementById('app-title').innerHTML = details.name + (app.source === "AUR" ? "<span class='aur-title'>(AUR)</span>" : "");
        document.getElementById('app-version').textContent = `v${details.version}`;
        document.getElementById('app-description').textContent = details.description;

        const table = document.getElementById('details-table');
        table.innerHTML = Object.entries(details).map(([key, value]) => {
            if (key === 'url' && value) {
                // Crear un enlace clickeable para las URLs
                return `
                    <tr>
                        <td class="key">${key}</td>
                        <td><a href="#" class="app-url" data-url="${value}" style="color: #00A8FF; text-decoration: underline;">${value}</a></td>
                    </tr>
                `;
            }

            if (key === 'size' && value) {
                return `
                    <tr>
                        <td class="key">${key}</td>
                        <td>${value.value} ${value.unit}</td>
                    </tr>
                `;
            }

            return `
                <tr>
                    <td class="key">${key}</td>
                    <td>${Array.isArray(value) ? value.join(', ') : value}</td>
                </tr>
            `;
        }).join('');

        // Agregar un event listener a las URLs clickeables
        document.querySelectorAll('.app-url').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = e.target.dataset.url;
                require('electron').shell.openExternal(url); // Abre la URL en el navegador predeterminado
            });
        });
    } catch (error) {
        console.error('Error loading app details:', error);
    }
}

// Filtrar apps desde el menú
ipcRenderer.on('filter', (_, filter) => {
    currentFilter = filter;
    filterApps(document.querySelector('input').value);
});

// Mostrar About desde el menú
ipcRenderer.on('about', () => {
    alert('Electron App\nVersion 1.0\nDeveloped by You');
});

document.getElementById('searchBar').addEventListener('keyup', (e) => {
    const query = e.target.value.toLowerCase();

    // Filtrar las aplicaciones basándose en el nombre
    filteredApps = apps.filter(app => app.name.toLowerCase().includes(query));

    // Actualizar la lista con las aplicaciones filtradas
    updateAppList();
});

function adjustAppListHeight() {
    log.info("Adjusting app list height...");
    const searchBar = document.getElementById('searchBar');
    const appList = document.getElementById('app-list');
    const totalOffset = searchBar.offsetHeight + searchBar.offsetTop; // Altura + espacio desde arriba

    // Resta cualquier margen o padding del contenedor padre
    const parentPaddingBottom = parseInt(window.getComputedStyle(appList.parentElement).paddingBottom) || 0;

    // Calcular la altura restante de la ventana
    const availableHeight = window.innerHeight - totalOffset - parentPaddingBottom;

    appList.style.height = `${availableHeight - 30}px`;
}


// Ajustar el scroll al cargar y al redimensionar
adjustAppListHeight();
window.addEventListener('resize', adjustAppListHeight);
window.addEventListener('load', adjustAppListHeight);

function selectFirstApp() {
    if (filteredApps.length > 0) {
        const firstAppElement = document.querySelector('#app-list > div');
        if (firstAppElement) {
            firstAppElement.click(); // Simula un clic en la primera app
        }
    }
}
