async function loadAppDetails(name, installed) {
    log.info("LoadAppDetails: " + name + " " + installed);

    const endpoint = `http://localhost:8080/api/v1/packages/info/${name}`;
    log.info(endpoint);
    try {
        const response = await axios.get(endpoint);
        const pack = response.data.pack;

        // Determinar clases y símbolos
        const appIconClass = installed === "true" ? 'installed-app-icon' : 'not-installed-app-icon';
        const appIconSymbol = installed === "true" ? '● ' : '○ ';
        const sourceClass = pack.repository === 'aur' ? 'aur-source-title' : 'source-title';

        // Construir el HTML
        const appTitleHTML = `
            <span class="${appIconClass}">${appIconSymbol}</span>
            ${pack.name}
            <span class="${sourceClass}">(${pack.repository})</span>
        `;

        // Asignar al elemento
        document.getElementById('app-title').innerHTML = appTitleHTML;
        document.getElementById('app-version').textContent = `v${pack.version}`;
        document.getElementById('app-description').textContent = pack.description;

        if (pack.url.startsWith('http')) {
            document.getElementById('url').innerHTML = `<a class="app-url" href="#" data-url='${pack.url}'>${pack.url}</a>`;
        } else {
            document.getElementById('url').innerHTML = "";
        }
        
        if (pack.repository === 'aur') {
            document.getElementById('aur-url').innerHTML = `<a class="app-url" href="#" data-url='${pack.aurUrl}'>${pack.aurUrl}</a>`;
        } else {
            document.getElementById('aur-url').innerHTML = "";
        }

        const table = document.getElementById('details-table');
        table.innerHTML = Object.entries(pack).map(([key, value]) => {
            if (key === 'url' && value) {
                // Crear un enlace clickeable para las URLs
                return `
                    <tr>
                        <td class="key">${key}</td>
                        <td><a href="#" class="app-url" data-url="${value}">${value}</a></td>
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
