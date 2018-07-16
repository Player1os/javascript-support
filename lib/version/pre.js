// Load local modules.
const {
	executeInherited,
	isScriptDefined,
	success,
} = require('../common')

// Define the current task name.
const taskName = 'PREVERSION'

// Ensure the master branch is checked out.
executeInherited(taskName, 'git', ['checkout', 'master'])

// Ensure no newer version of the branch is published.
executeInherited(taskName, 'git', ['pull'])

// Ensure all dependencies are installed.
executeInherited(taskName, 'npm', ['i'])

// Check whether a test script is defined.
if (isScriptDefined('test')) {
	// Ensure all the tests pass successfully.
	executeInherited(taskName, 'npm', ['test'])
}

// Report the task's success.
success(taskName)
