console.log('Global Preload Script')

const { ipcRenderer } = require("electron")
const log = require('electron-log')
Object.assign(console, log.functions)

window.prompt = (message, defaultValue) => ipcRenderer.sendSync('prompt', message, defaultValue)