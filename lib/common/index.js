// Load local modules.
const format = require('./format')
const packageConfiguration = require('./package_configuration')
const spawnChildProcess = require('./spawn_child_process')

// Aggregate and export the loaded modules.
module.exports = {
	format,
	packageConfiguration,
	spawnChildProcess,
}
