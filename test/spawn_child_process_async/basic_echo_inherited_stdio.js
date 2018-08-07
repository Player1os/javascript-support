// Load runtime modules.
require('../../lib/runtime')

// Load local modules.
const { spawnChildProcess } = require('.../lib')

// Spawn a process with inherited stdio.
spawnChildProcess.inherited('TEST RUN', 'echo', ['Hello world!'])
	.catch((err) => {
		process.nexTick(() => {
			throw err
		})
	})
