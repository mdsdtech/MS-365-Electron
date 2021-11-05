const { app, Menu, BrowserWindow, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const isMac = process.platform === "darwin";
const openAboutWindow = require("about-window").default;
const isOnline = require("is-online");
const Store = require("electron-store");
const store = new Store();

const template = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  {
    label: "Application",
    submenu: [
      {
        label: "About MS Office - Electron",
        click: () =>
          openAboutWindow({
            icon_path:
              "https://github.com/agam778/MS-Office-Electron/blob/main/icon2.png?raw=true",
            product_name: "MS Office - Electron",
            copyright: "Copyright (c) 2021 Agampreet Singh Bajaj",
            package_json_dir: __dirname,
            bug_report_url:
              "https://github.com/agam778/MS-Office-Electron/issues/",
            bug_link_text: "Report an issue",
            adjust_window_size: "2",
            show_close_button: "Close",
          }),
      },
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal(
            "https://github.com/agam778/MS-Office-Electron"
          );
        },
      },
      { type: "separator" },
      {
        label: "Open Normal version of MS Office",
        type: "radio",
        click() {
          store.set(
            "enterprise-or-normal",
            "https://agam778.github.io/MS-Office-Electron/loading"
          );
        },
        checked:
          store.get("enterprise-or-normal") ===
          "https://agam778.github.io/MS-Office-Electron/loading",
      },
      {
        label: "Open Enterprise version of MS Office",
        type: "radio",
        click() {
          store.set("enterprise-or-normal", "https://office.com/?auth=2");
        },
        checked:
          store.get("enterprise-or-normal") === "https://office.com/?auth=2",
      },
      { type: "separator" },
      {
        role: "quit",
        accelerator: process.platform === "darwin" ? "Ctrl+Q" : "Ctrl+Q",
      },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
    ],
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { type: "separator" },
      { role: "resetZoom" },
      {
        role: "zoomIn",
        accelerator: process.platform === "darwin" ? "Control+=" : "Control+=",
      },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

function createWindow() {
  const win = new BrowserWindow({
    width: 1181,
    height: 670,
    icon: "./icon.png",
    webPreferences: {
      nodeIntegration: true,
      devTools: false,
    },
  });

  win.loadURL(`${store.get("enterprise-or-normal")}`, {
    userAgent:
      "Mozilla/5.0 (x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("ready", function () {
  isOnline().then((online) => {
    if (online) {
      console.log("You are connected to the internet!");
    } else {
      const options = {
        type: "warning",
        buttons: ["Ok"],
        defaultId: 2,
        title: "Warning",
        message: "You appear to be offline!",
        detail:
          "Please check your Internet Connectivity. This app cannot run without an Internet Connection!",
      };

      dialog.showMessageBox(null, options, (response) => {
        console.log(response);
      });
    }
  });
  autoUpdater.checkForUpdatesAndNotify();
});
