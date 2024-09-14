const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const log = require('electron-log');
const Store = require('./Store');
const path = require('path');
const MainWindow = require('./MainWindow');
const AppTray = require('./AppTray');

// Set env
let process = 'production';

const isDev = process !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow;
let tray;


// Init store & defaults
const store = new Store({
  configName: 'user-settings',
  defaults: {
    settings: {
      cpuOverload: 80,
      alertFrequency: 3
    }
  }
})

function createMainWindow() {
  mainWindow = new MainWindow('./app/index.html', isDev);
}

app.on('ready', () => {
  createMainWindow();

  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.send('settings:get', store.get('settings'))
  });

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  mainMenu.on('close', (event) => {
    if(!app.isQuitting){
      event.preventDefault();
      mainWindow.hide();
    }

    return true;
  });

  // Tray Icon
  const icon = path.join(__dirname, 'assets', 'tray_icon.png');
  tray = new AppTray(icon, mainWindow);

});

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  {
    label: 'View', 
    submenu: [
      {
        label: 'Toggle Navigation',
        click: () => mainWindow.webContents.send('nav:toggle')
      }
    ]
  },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
]

// Set Settings
ipcMain.on('settings:set', (event, value) => {
  store.set('settings', value);
  mainWindow.webContents.send('settings:get', store.get('settings'))
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

app.allowRendererProcessReuse = true
