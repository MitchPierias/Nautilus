// Modules
const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const chokidar = require('chokidar');
const { exec } = require('child_process');
const colors = require('colors');
  
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
	// Create the browser window.
	mainWindow = new BrowserWindow({width: 900, height: 680});

	// and load the index.html of the app.
	mainWindow.loadURL(`file://${__dirname}/public/index.html`);
	// Open the DevTools.
	mainWindow.webContents.openDevTools()


	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
	  // Dereference the window object, usually you would store windows
	  // in an array if your app supports multi windows, this is the time
	  // when you should delete the corresponding element.
	  mainWindow = null
	})

	const menu = Menu.buildFromTemplate([
		{
			label:'Menu',
			submenu:[
				{label:'Environment'},
				{label:'Set Provider'}
			]
		}, {
			label:'Accounts',
			submenu:[
				{
					label:'Create'
				}, {
					label:'Keys',
					submenu:[
						{label:'Generate Private Key'},
						{label:'Generate Public Key'}
					]
				}
			]
		}, {
			label:'Contracts',
			submenu:[
				{label:'Scan'},
				{label:'Build'},
				{label:'Test'},
				{label:'Deploy'}
			]
		}, {
			label:'Transactions',
			submenu:[
				{label:'Create'},
				{label:'History'}
			]
		},
	]);

	Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
	  createWindow()
	}
});

/**
 * Executes simple shell command
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
async function execute(cmd) {
	return new Promise(function (resolve, reject) {
		exec(cmd, (err, stdout, stderr) => {
			if (err) {
				reject(err);
			} else {
				resolve({ stdout, stderr });
			}
		});
	});
}

ipcMain.on('compile:file', (event, file) => {

	const inputPath = file.path+file.contract+'.cpp';
	const outputPath = file.path+file.file;
	const typeFlag = (file.type==='wasm')?'-o':'-g';

	execute(`eosiocpp ${typeFlag} ${outputPath} ${inputPath}`).then(({ stdout, stderr }) => {
		file.modified = +new Date;
		mainWindow.webContents.send('compile:complete', file);
	}).catch((err) => {
		console.log(colors.red(err));
	});
})

ipcMain.on('directory:watch', (event, directory) => {

	const watcher = chokidar.watch(directory, {
		ignored: /[\/\\]\./,
		persistent: true
	});

	function onWatcherReady() {
		console.info('Chokidar is watching directory.',directory);
	}
	// Declare the listeners of the watcher
	watcher.on('add', function(path) {
		mainWindow.webContents.send('directory:file', path);
	}).on('addDir', function(path) {
		console.log('Directory', path, 'has been added');
	}).on('change', function(path) {
		console.log('File', path, 'has been changed');
	}).on('unlink', function(path) {
		console.log('File', path, 'has been removed');
	}).on('unlinkDir', function(path) {
		console.log('Directory', path, 'has been removed');
	}).on('error', function(error) {
		console.log('Error happened', error);
	}).on('ready', onWatcherReady);
});