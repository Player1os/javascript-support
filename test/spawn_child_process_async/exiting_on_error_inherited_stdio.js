// Load runtime modules.
require('../../lib/runtime')

// Load local modules.
const common = require('.../lib')

// Load node modules.
const fs = require('fs')
const path = require('path')

// Load the expected results for the failing application.
const failingApplicationResults = JSON.parse(fs.readFileSync(path.join(__dirname, 'failing_application_result.json'), 'utf-8'))

// Spawn a process with inherited stdio.
common.spawnChildProcessAsync.inherited(
	'TEST RUN', 'node', [path.join(__dirname, 'returns_plus_one.js'), failingApplicationResults.stdout, failingApplicationResults.stderr]
)
