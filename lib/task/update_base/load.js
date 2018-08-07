// Load local modules.
const { success } = require('.../lib/common/format')
const { inherited: spawnProcessInherited } = require('.../lib/common/spawn_child_process_async')

// Define the current task name.
const taskName = 'UPDATE BASE: LOAD'

;(async () => {
	// Fetch the origin remote repository's branches.
	await spawnProcessInherited(taskName, 'git', ['fetch'])

	// Fetch the base remote repository's branches.
	await spawnProcessInherited(taskName, 'git', ['fetch', 'base'])

	// Make sure we are in the project's master branch.
	await spawnProcessInherited(taskName, 'git', ['checkout', 'master'])

	// Make a hard reset of the master branch to where the origin remote repository's master branch is pointing.
	await spawnProcessInherited(taskName, 'git', ['reset', '--hard', 'origin/master'])

	// Overwrite the local repository's tags with those found in the origin remote repository.
	await spawnProcessInherited(taskName, 'git', ['fetch', '--tags', '-p'])

	// Ensure any new dependencies are installed.
	await spawnProcessInherited(taskName, 'npm', ['i'])

	// Execute garbage collection upon the repository.
	await spawnProcessInherited(taskName, 'git', ['gc'])

	// Report the task's success.
	success(taskName)
})()
