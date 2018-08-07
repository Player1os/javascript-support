// Load local modules.
const { success } = require('../common/format')
const { isScriptDefined } = require('../common/package_configuration')
const { inherited: spawnProcessInherited } = require('../common/spawn_child_process_async')

// Define the current task name.
const taskName = 'PREVERSION'

;(async () => {
	// Ensure the master branch is checked out.
	await spawnProcessInherited(taskName, 'git', ['checkout', 'master'])

	// Ensure no newer version of the branch is published.
	await spawnProcessInherited(taskName, 'git', ['pull'])

	// Ensure all dependencies are installed.
	await spawnProcessInherited(taskName, 'npm', ['i'])

	// Check whether a test script is defined.
	if (isScriptDefined('test')) {
		// Ensure all the tests pass successfully.
		await spawnProcessInherited(taskName, 'npm', ['test'])
	}

	// Report the task's success.
	success(taskName)
})()
