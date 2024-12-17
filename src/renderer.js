const axios = require('axios');
const { ipcRenderer } = require('electron');
const log = require('electron-log');


// Ajustar el scroll al cargar y al redimensionar
adjustAppListHeight();
window.addEventListener('resize', adjustAppListHeight);
window.addEventListener('load', adjustAppListHeight);

// Filtrar apps desde el menú
ipcRenderer.on('filter', (_, filter) => {
    alert(filter);
});

// Mostrar About desde el menú
ipcRenderer.on('about', () => {
    alert('Electron App\nVersion 1.0\nDeveloped by You');
});

document.getElementById('searchBar').addEventListener('keyup', async (e) => {
    if (e.key !== 'Enter') {
        return;
    }

    const input = e.target;
    const query = input.value.trim(); // Obtener el valor del input
    const spinner = document.getElementById('spinner');

    if (query) {
        try {
            spinner.style.display = 'block'; // Mostrar spinner
            const response = await fetch(`http://localhost:8080/api/v1/packages/${query}`);
            const data = await response.json();

            // Filtrar y renderizar los resultados
            const packages = data.packages || [];
            renderAppList(packages);
        } catch (error) {
            log.info('Error fetching packages:', error);
            renderAppList([]); // Limpiar lista si hay error
        } finally {
            spinner.style.display = 'none'; // Ocultar spinner
        }
    }
});

// Función para renderizar la lista de aplicaciones
function renderAppList(packages) {
    const appListContainer = document.getElementById('app-list');

    // Generar el contenido HTML
    appListContainer.innerHTML = packages.map(app => `
        <div class="p-2 ${app.installed ? 'installed' : 'not-installed'}" data-name="${app.name}">
            ${app.name} (${app.source})
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
            loadAppDetails(item.dataset.name);
        });

        // Seleccionar la primera app por defecto
        if (index === 0) {
            item.classList.add('selected');
            // Uncomment if you want to load details of the first app by default
            loadAppDetails(item.dataset.name);
        }
    });
}

async function loadAppDetails(name) {
    log.info("LoadAppDetails: " + name);

    const endpoint = `http://localhost:8080/api/v1/packages/info/${name}`;
    log.info(endpoint);
    try {
        const response = await axios.get(endpoint);
        const pack = response.data.pack;

        document.getElementById('app-title').innerHTML = pack.name + "<span class='aur-title'> (" + pack.repository + ")</span>";
        document.getElementById('app-version').textContent = `v${pack.version}`;
        document.getElementById('app-description').textContent = pack.description;

        const table = document.getElementById('details-table');
        table.innerHTML = Object.entries(pack).map(([key, value]) => {
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
        log.info('Error loading app details:', error);
    }
}

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