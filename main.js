// Modules
const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron');
const _path = require('path');
const chokidar = require('chokidar');
const { exec } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const colors = require('colors');
const ElectronStore = require('electron-store');
const Database = require('./api/stores/FileStore');
const createHash = require('create-hash');

const { files, accounts, contracts, settings } = Database;

const keys = [process.env.EOS_PUBLIC_KEY];
const AUTO_LINK = true;
const APP_ICON_PATH = _path.join(__dirname, 'assets/icon.png');
const COMPILE_FLAGS_OUTPUT_TYPE = {'wasm':'o','abi':'g'}
// Global References
let appIcon, mainWindow, watcher;

function createWindow () {
	// Create the browser window.
	mainWindow = new BrowserWindow({width:1000,height:700,minWidth:500,minHeight:600});

	// and load the index.html of the app.
	mainWindow.loadURL('http://localhost:9000'); // `file://${__dirname}/public/index.html`
	// Open the DevTools.
	mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
	  // Dereference the window object, usually you would store windows
	  // in an array if your app supports multi windows, this is the time
	  // when you should delete the corresponding element.
	  mainWindow = null
	})

	appIcon = new Tray(APP_ICON_PATH);

	const trayMenu = Menu.buildFromTemplate([
		{
			label:'Item1',
			type:'radio'
		}
	]);

	appIcon.setContextMenu(trayMenu);

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

	watcher = chokidar.watch(settings.get('directory'), {
		ignored: /[\/\\]\./,
		persistent: true
	});
	// Declare the listeners of the watcher
	watcher.on('add', function(fullPath, { size, birthtimeMs }) {

		const dirPattern = /(.*\/).*/gi;
		const pathComponents = dirPattern.exec(fullPath);
		const fileComponents = fullPath.replace(pathComponents[1],'').split('.');
		
		const path = pathComponents[1];
		const name = fileComponents[0];
		const extension = fileComponents[1];
		// Update the file storage
		files.add(fullPath, { name, extension, path, file:fileComponents.join('.'), size });
	}).on('addDir', function(fullPath) {
		//console.log('Directory', fullPath, 'has been added');
	}).on('change', function(fullPath) {
		// Update cache and notify render process
		files.modified(fullPath);
		mainWindow.webContents.send('file:changed', fullPath);
	}).on('unlink', function(fullPath) {
		// Update cache and notify render process
		const uid = createHash('sha1').update(fullPath).digest('hex');
		files.delete(uid);
		mainWindow.webContents.send('file:removed', fullPath);
	}).on('unlinkDir', function(fullPath) {
		//console.log(colors.red("Removed directory"),colors.grey(fullPath));
	}).on('error', function(error) {
		//console.log('Error happened', error);
	}).on('ready', function() {
		console.info(colors.cyan('Watching directory: '+settings.get('directory')));
	});
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

ipcMain.on('compile:contract', (event, { name, type }) => {
	// Validate arguments
	if ('string' !== typeof name) throw new Error("Invalid contract name");
	if (!type || !(type==='wasm'||type==='abi')) throw new Error("Invalid file type");

	// Fetch contract
	const contract = contracts.get(name);
	const inputFile = files.get(contract.contract);
	// Construct file paths
	const inputPath = inputFile.path+inputFile.file;
	const outputPath = inputFile.path+inputFile.name+'.'+type;
	// Run compile command
	execute(`eosiocpp -${COMPILE_FLAGS_OUTPUT_TYPE[type]} ${outputPath} ${inputPath}`).then(({ stdout, stderr }) => {
		files.compiled(outputPath);
		mainWindow.webContents.send('compile:complete', { inputPath, outputPath, type });
	}).catch((err) => {
		console.log(colors.red(err));
	});
});

ipcMain.on('deploy:contract', (event, { code, files }) => {

	const promises = files.map(({ uid, type, fullPath }) => {

		const timestamp = +new Date;
		
		if (type === 'wasm') {
			const file = fs.readFileSync(fullPath);
			return eos.setcode(code, 0, 0, file).then(receipt => {
				files.update(fullPath, {modified:false,deployed:timestamp});
				mainWindow.webContents.send('deploy:success', fullPath);
			}).catch(err => {
				const { code, message, error } = JSON.parse(err);
				if (error.code === 3160008) {
					files.update(fullPath, {modified:false,deployed:timestamp});
					mainWindow.webContents.send('deploy:success', fullPath);
				} else {
					console.log(colors.red("ERROR"),colors.yellow("("+code+" : "+message+")"),colors.grey("("+error.code+") "+error.what));
				}
			});
		} else if (type === 'abi') {
			const file = fs.readFileSync(fullPath);
			return eos.setabi(code, JSON.parse(file)).then(receipt => {
				files.update(fullPath, {modified:false,deployed:timestamp});
				mainWindow.webContents.send('deploy:success', fullPath);
			}).catch(err => {
				const { code, message, error } = JSON.parse(err);
				console.log(colors.red(code),colors.yellow(message),colors.grey(error.what));
			});
		} else {
			return false;
		}
	});

	Promise.all(promises).then((results) => {
		//console.log(results);
		mainWindow.webContents.send('deploy:complete', code);
	}).catch((err) => {
		const { code, message, error } = JSON.parse(err);
		console.log(colors.red(code),colors.yellow(message),colors.grey(error.what));
	});
});

ipcMain.on('directory:watch', (event, fullPath) => {
	const currentPaths = watcher.getWatched();
	console.log("Watching", Object.keys(currentPaths));
	watcher.unwatch(Object.keys(currentPaths));
	settings.set('directory',fullPath);
	console.log("Cleared paths, add", settings.get('directory'))
	watcher.add(fullPath);
});

ipcMain.on('account:create', (event, name) => {


});

const AccountService = require('./api/services/AccountService');

ipcMain.on('accounts:load', (event, public_key) => {
	// Cleanse arguments
	if ('string' !== typeof public_key) public_key = keys[0];
	// Fetch accounts for public key
	AccountService.all(public_key).then(account_names => {
		// Remap names
		account_names = account_names.map(name => { return {name,code:'',id:name} });
		// Update database
		accounts.syncCache(account_names);
		account_names.forEach(account => accounts.update(account));
		// Notify interface
		mainWindow.webContents.send('accounts:loaded', account_names);
	}).catch(err => {
		console.log(colors.red("ERROR"),colors.grey(err));
	});
});

ipcMain.on('account:get', (event, name) => {
	// Fetch accounts for public key
	AccountService.getAccount(name).then(account => {
		// Update database
		//accounts.update(account);
		// Notify interface
		mainWindow.webContents.send('account:received', account);
	}).catch(err => {
		console.log(colors.red("ERROR"),colors.grey(err));
	});
});

ipcMain.on('code:get', (event, name) => {
	// Fetch accounts for public key
	AccountService.getCode(name).then(contract => {
		// Update database
		accounts.update(contract);
		// Notify interface
		mainWindow.webContents.send('code:received', contract.code);
	}).catch(err => {
		console.log(colors.red("ERROR"),colors.grey(err));
	});
});

ipcMain.on('contract:create', (event, code) => {

	const contract = contracts.get(code, DEFAULT_CONTRACT_DATA);
	if (contract) {
		contract.code = code;
		contract.name = code;
	}
	contracts.set(code, contract);
	mainWindow.webContents.send('contract:created', contract);
});

ipcMain.on('contract:link', (event, { name, type, file }) => {
	contracts.update(name, { [type]:file });
	mainWindow.webContents.send('contract:linked', { name, type, file });
});