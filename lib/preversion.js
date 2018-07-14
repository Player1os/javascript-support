#!/usr/bin/env node

// Load local modules.
const {
	execute,
	isScriptDefined,
	success,
} = require('./common')

// Ensure the master branch is checked out.
execute('PREVERSION', 'git', ['checkout', 'master'])

// Ensure no newer version of the branch is published.
execute('PREVERSION', 'git', ['pull'])

// Ensure all dependencies are installed.
execute('PREVERSION', 'npm', ['i'])

// Check whether a test script is defined.
if (isScriptDefined('test')) {
	// Ensure all the tests pass successfully.
	execute('PREVERSION', 'npm', ['test'])
}

// Report success.
success('PREVERSION')
