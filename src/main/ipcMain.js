
import { ipcMain, BrowserWindow } from 'electron'


ipcMain.on("handle_btn", function (err, data) {
    var mainWindow = BrowserWindow.getFocusedWindow()
    switch (data) {
        case "small":
            mainWindow.minimize()
            break
        case "big":
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize()
            }else {
                mainWindow.maximize()
            }
            break
        case "cancel":
            mainWindow.close()
            break
        default:
            break
    }
})