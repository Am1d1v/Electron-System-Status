const { app, BrowserWindow, Menu, ipcMain, Tray } = require('electron')
const log = require('electron-log');
const Store = require('./Store');
const path = require('path');

// Set env
let process = 'development'

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
  mainWindow = new BrowserWindow();

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadFile('./app/index.html')
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
  tray = new Tray(icon);

  tray.on('click', () => {
    // Tray Visibilty toggle 
    if(mainWindow.isVisible() === true){
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  // Close Tray on Right Click
  tray.on('right-click', () => {

    const context = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => {
          app.isQuitting = true;
          app.quit();
        }
      }
    ]);

    // Show PopUp Menu on Right Click
    tray.popUpContextMenu(context);

  });

})

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
