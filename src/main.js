const electron = require('electron');
const countdown = require('./countdown')
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const path = require('path');
const windows = []

let mainWindow

const { app, Menu, Tray } = electron;

app.on('ready', _ => {
    const tray = new Tray(path.join('src', 'trayIcon.png'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Wow',
            click: _=> console.log('wow')
        },
        {
            label: 'Awesome',
            click: _=> console.log('awesome')
        }
    ])
    
    tray.setContextMenu(contextMenu);
    tray.setToolTip('My great app');
 
    [1, 2, 3].forEach(i => {
        let win = new BrowserWindow({
                height: 600,
                width: 400
            })
            win.loadURL(`file://${__dirname}/countdown.html`)
            win.on('closed', _ => {
            win = null;
        })
        windows.push(win);
    })
    
    const name = electron.app.getName();
    const template = [
        {
            label: name,
            submenu: [{
                label: `About ${name}`,
                click: _ => {
                    console.log('click');
                },
                role: 'about'
            }, {
                type: 'separator'
            }, {
                label: 'Quit',
                click: _=> { app.quit(); },
                accelerator: 'Ctrl+Q'
            }]
        }
    ]
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
})

ipc.on('countdown-start', _ => {
    countdown(count => {
        windows.forEach(win => {
            win.webContents.send('countdown', count);
        })
    })
})