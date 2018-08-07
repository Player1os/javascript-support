// Load runtime modules.
require('../../lib/runtime')

// Load local modules.
const common = require('.../lib')

// Spawn a process with inherited stdio.
common.spawnChildProcessAsync.inherited('TEST RUN', 'echo', ['Hello world!'])
	.catch((err) => {
		process.nexTick(() => {
			throw err
		})
	})
