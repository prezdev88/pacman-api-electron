async function searchListener(e) {
    if (e.key !== 'Enter') {
        return;
    }

    const input = e.target;
    const query = input.value.trim();
    const spinner = document.getElementById('spinner');

    if (!query) {
        return;
    }

    try {
        const endpoint = `http://localhost:8080/api/v1/packages/${query}`;

        log.info(endpoint);

        spinner.style.display = 'block';
        const response = await fetch(endpoint);
        const data = await response.json();

        const packages = data.packages || [];
        renderAppList(packages);
    } catch (error) {
        log.info('Error fetching packages:', error);
        renderAppList([]);
    } finally {
        spinner.style.display = 'none';
    }
}
