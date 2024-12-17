async function searchListener(e) {
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
}
