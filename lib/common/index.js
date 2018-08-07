// Load local modules.
const format = require('.../lib/common/format.js')
const packageConfiguration = require('.../lib/common/package_configuration.js')
const spawnChildProcessAsync = require('.../lib/common/spawn_child_process_async.js')

// Aggregate and export the loaded modules.
module.exports = {
	format,
	packageConfiguration,
	spawnChildProcessAsync,
}
