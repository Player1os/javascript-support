// Load local modules.
const { success } = require('../../common/format')
const { inherited: spawnChildProcessInherited } = require('../../common/spawn_child_process')

// Define the current task name.
const taskName = 'UPDATE BASE: LOAD'

;(async () => {
	// Fetch the origin remote repository's branches.
	await spawnChildProcessInherited(taskName, 'git', ['fetch'])

	// Fetch the base remote repository's branches.
	await spawnChildProcessInherited(taskName, 'git', ['fetch', 'base'])

	// Make sure we are in the project's master branch.
	await spawnChildProcessInherited(taskName, 'git', ['checkout', 'master'])

	// Make a hard reset of the master branch to where the origin remote repository's master branch is pointing.
	await spawnChildProcessInherited(taskName, 'git', ['reset', '--hard', 'origin/master'])

	// Overwrite the local repository's tags with those found in the origin remote repository.
	await spawnChildProcessInherited(taskName, 'git', ['fetch', '--tags', '-p'])

	// Ensure any new dependencies are installed.
	await spawnChildProcessInherited(taskName, 'npm', ['i'])

	// Execute garbage collection upon the repository.
	await spawnChildProcessInherited(taskName, 'git', ['gc'])

	// Report the task's success.
	success(taskName)
})()
