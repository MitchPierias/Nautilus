export default function startWatcher(dirName) {
	
	const chokidar = require('chokidar');

	var watcher = chokidar.watch(dirName, {
		ignored: /[\/\\]\./,
		persistent: true
	});

	function onWatcherReady(){
		console.info('Watcher has started observing '+dirName);
	}

	// Declare the listeners of the watcher
	watcher.on('add', function(path) {
		console.log('File', path, 'has been added');
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
	}).on('ready', onWatcherReady)
	.on('raw', function(event, path, details) {
	// This event should be triggered everytime something happens.
		console.log('Raw event info:', event, path, details);
	});
}