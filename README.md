npm init -y
npm install --save-dev electron
npm install electron-builder --save-dev

# package.json
"scripts": {
    "start": "electron ./src/main.js"
}

# Build
```bash
rm -rf dist node_modules
npm install
npm run build
```