const axios = require('axios');

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
