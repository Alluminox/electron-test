const path = require('path')
const MouseTrap = require('mousetrap');
const { remote } = require("electron")

document.addEventListener('DOMContentLoaded', () => {

  const mainWindow = remote.BrowserWindow.getFocusedWindow();

   new Vue({
    el: "#app",
    state() {

    },
    methods: {
      maximizar() {
        if (mainWindow.isMaximized()) {
          console.log("Maximizar")
          mainWindow.unmaximize();
          return;
        }

        mainWindow.maximize();
      },
      minimizar() {
        mainWindow.minimize()
      },
      fullscreen() {
        mainWindow.setFullScreen(!mainWindow.isFullScreen())
      },
      fechar() {
        mainWindow.close()
      }
    },
    created() {
      let notification = new Notification('Evento Promocional', {
        body: 'Saiba mais sobre as promocoes',
        icon: path.join(__dirname, 'tray.png')
      })

      // notification.onclick = () => console.log("")
    }
  })

  // Comandos
  MouseTrap.bind('up up down down left right t', () => {
    alert('Jimmy Codder')
  })
 })