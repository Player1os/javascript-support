// Load local modules.
const format = require('./format.js')
const packageConfiguration = require('./package_configuration.js')
const spawnChildProcessAsync = require('./spawn_child_process_async.js')

// Aggregate and export the loaded modules.
module.exports = {
	format,
	packageConfiguration,
	spawnChildProcessAsync,
}
