console.log('Global Preload Script')

const { remote, ipcRenderer } = require("electron")
const Store = require('electron-store')
const config = new Store()
const path = require('path')
const argv = require('yargs').argv // TODO: Apply main process arguments
const log = require('electron-log')
const shortcuts = require('electron-localshortcut')
Object.assign(console, log.functions)

const DEBUG = Boolean(argv.debug || config.get('debug'))

window.prompt = (message, defaultValue) => ipcRenderer.sendSync('prompt', message, defaultValue)