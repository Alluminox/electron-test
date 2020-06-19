const path = require("path");
const url = require("url");

const { BrowserWindow, app, Tray, Menu, globalShortcut, dialog } = require("electron");
const { autoUpdater } = require("electron-updater")

// HOT-HEALOAD da webview(HTML, CSS, JS)
if (process.env.NODE_ENV === 'dev') {

  const electronReload = require('electron-reload');
  electronReload(__dirname);
}

// Para que as notificações funcionem no Windows 10!
app.setAppUserModelId('br.com.alluminox.geoapp');

// CRIAR A TELA INICIAL
const createWindow = () => {
  const  mainWindow = new BrowserWindow({
    width: 500,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });
  
  // Inicia a tela com o devtools aberto
  if (process.env.NODE_ENV === 'dev') {
    mainWindow.webContents.openDevTools();
  }

  // Carrega a index.html  
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: "file:",
    slashes: true
  }))


  // Eventos da Tela
  mainWindow.on('resize', () => console.log("resize"))
  mainWindow.on('responsive', () => console.log("responsive"))

  mainWindow.on('maximize', () => console.log("maximized"))
  mainWindow.on('unmaximize', () => console.log("unmaximized"))
  mainWindow.on('restore', () => console.log("restore"))
  
  // 1 - Quando clicar para minimizar, escondemos a TELA
  mainWindow.on('minimize', (e) => {
    e.preventDefault();
    mainWindow.hide();
  })

  // 2 - Quando clicar para minimizar e a propriedade 'isQuiting' não existir nos escondemos a tela
  mainWindow.on('close', (e) => {
    if (!app.isQuiting) {
      e.preventDefault();
      mainWindow.hide();
    }
  })


  // 3 - Quando a janela for fechada
  mainWindow.on("closed", (e) => {
    // e.preventDefault();
    console.log("Main Window has been closed!")
  });


  // Cria o menu da Tray
  let contextMenu = Menu.buildFromTemplate([
    {
      icon: '',
      label: 'Show App',
      click: () => {
        console.log("Show App")
        // if (mainWindow.isMaximizable()) mainWindow.maximize()
        mainWindow.show();
      }
    }, 
    {
      icon: '',
      label: 'Sair',
      click: () => {
        console.log("Leave App")
        app.isQuiting = true;
        app.quit(); // chama o método quit, que chama o método CLOSE internamente
      }
    }
  ])

  // Criando a tray e associando o menu com os eventos
  let tray = new Tray(path.join(__dirname, 'tray.png'))
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
        return mainWindow.hide()
    }
    mainWindow.show();
  });

  // Registrando atalhos da APP
  globalShortcut.register('CommandOrControl+X', () => {
    console.log('Ctrl+x is calling')
  });

  globalShortcut.register('Alt+A', () => {
    console.log('Alt+A is calling')
  });

  globalShortcut.register("CommandOrControl+Q", () => {
    app.isQuiting = true;
    app.quit();
  })
}

const sendStatusToWindow = (detail) => {
  const config = {
    type: 'info',
    buttons: ['Ok'],
    title: 'Autalização do aplicativo!',
    message: 'Detalhes',
    detail
  }
  dialog.showMessageBox(config)
}


const checkUpdates = () => {
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update!')
  })

  autoUpdater.on('update-available', () => {
    sendStatusToWindow('Available update')
  })

  autoUpdater.on('update-not-available', () => {
    sendStatusToWindow('Unavailable update')
  })

  autoUpdater.on('error', () => {
    sendStatusToWindow('Error into auto-update')
  });

  autoUpdater.on('download-progress', progress => {
    const log = `Download speed ${progress.bytesPerSecond} - Downloaded ${progress.percent} - ${progress.transferred}/ ${progress.total}`
    sendStatusToWindow(log)
  })
  autoUpdater.on('update-downloaded', info => {
    sendStatusToWindow('Update downloaded') // Finishing
  })

}

(async () => {
  await app.whenReady()
  checkUpdates();
  createWindow();

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  })

  app.on('before-quit', () => {
    console.log("Before quiting browse window!")
  });
})()