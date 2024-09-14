const {BrowserWindow} = require('electron');


class MainWindow extends BrowserWindow {
    constructor(){
        super(
            {
                title: 'CPU Monitoring',
                width: isDev ? 1800 : 900,
                height: 600,
                icon: './assets/icon.png',
                resizable: isDev ? true : false,
                backgroundColor: 'white',
                show: false,
                opacity: 1,
                webPreferences: {
                  nodeIntegration: true,
                }
              }
        );
    }


};