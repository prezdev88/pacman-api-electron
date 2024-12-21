const path = require('path');
const log = require('electron-log');
const { execFile } = require('child_process');
const fs = require('fs');

let apiProcess = null;

function executeBin() {
    const isDev = process.env.NODE_ENV === 'development' || process.defaultApp;
    const basePath = isDev
        ? path.join(__dirname, 'bin') // Ruta en desarrollo
        : path.join(process.resourcesPath, 'bin'); // Ruta en producción

    const binaryPath = path.join(basePath, 'pacman-api');

    // Validar si el binario existe
    if (!fs.existsSync(binaryPath)) {
        log.error('El binario no existe en la ruta:', binaryPath);
        return;
    }

    // Ejecutar el binario
    apiProcess = execFile(binaryPath, [], { cwd: path.dirname(binaryPath) }, (error, stdout, stderr) => {
        if (error) {
            log.error('Error ejecutando el binario:', error);
            return;
        }
        if (stderr) {
            log.warn('Stderr del binario:', stderr);
        }
        log.info('Output del binario:', stdout);
    });
}

function stopBin() {
    if (apiProcess) {
        log.info('Cerrando el binario...');
        apiProcess.kill();
        apiProcess = null;
    }
}

module.exports = { executeBin, stopBin };
