const {app, Menu, Tray} = require('electron');

class AppTray extends Tray{
    constructor(icon, mainWindow){
        super(icon);

        this.mainWindow = mainWindow;

        this.on('click', this.onClick.bind(this));

        this.on('right-click', this.onRightClick.bind(this));
    };

    onClick(){
        // Tray Visibilty toggle 
        if(this.mainWindow.isVisible() === true){
            this.mainWindow.hide();
          } else {
            this.mainWindow.show();
          }
    }

    onRightClick(){
        // Close Tray on Right Clic
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
        this.popUpContextMenu(context);
    }

};

module.exports = AppTray;