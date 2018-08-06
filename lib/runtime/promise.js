// Load npm modules.
const Bluebird = require('bluebird')

// Makes the script crash on unhandled rejections instead of silently ignoring them.
if (typeof process === 'object') {
	process.on('unhandledRejection', (err) => {
		throw err
	})
}

// Set the bluebird implementation as the default for promises in the node environment.
if (typeof global === 'object') {
	global.Promise = Bluebird
}

// Set the bluebird implementation as the default for promises in the browser environment.
if (typeof window === 'object') {
	window.Promise = Bluebird
}
