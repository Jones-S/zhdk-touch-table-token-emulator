const { app, BrowserWindow } = require('electron') // eslint-disable-line
const url = require('url') // eslint-disable-line
const path = require('path') // eslint-disable-line
let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `./dist/index.html`), // eslint-disable-line
      protocol: 'file:',
      slashes: true
    })
  )
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  mainWindow.loadFile('dist/index.html')
}

app.whenReady().then(() => {
  createWindow()
})
