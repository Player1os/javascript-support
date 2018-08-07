// Load local modules.
const { success } = require('../common/format')
const { isScriptDefined } = require('../common/package_configuration')
const { inherited: spawnChildProcessInherited } = require('../common/spawn_child_process')

// Define the current task name.
const taskName = 'PREVERSION'

;(async () => {
	// Ensure the master branch is checked out.
	await spawnChildProcessInherited(taskName, 'git', ['checkout', 'master'])

	// Ensure no newer version of the branch is published.
	await spawnChildProcessInherited(taskName, 'git', ['pull'])

	// Ensure all dependencies are installed.
	await spawnChildProcessInherited(taskName, 'npm', ['i'])

	// Check whether a test script is defined.
	if (isScriptDefined('test')) {
		// Ensure all the tests pass successfully.
		await spawnChildProcessInherited(taskName, 'npm', ['test'])
	}

	// Report the task's success.
	success(taskName)
})()
