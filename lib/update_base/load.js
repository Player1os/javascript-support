// Load local modules.
const {
	executeInherited,
	success,
} = require('../common')

// Define the current task name.
const taskName = 'UPDATE BASE: LOAD'

// Fetch the origin remote repository's branches.
executeInherited(taskName, 'git', ['fetch'])

// Fetch the base remote repository's branches.
executeInherited(taskName, 'git', ['fetch', 'base'])

// Make sure we are in the project's master branch.
executeInherited(taskName, 'git', ['checkout', 'master'])

// Make a hard reset of the master branch to where the origin remote repository's master branch is pointing.
executeInherited(taskName, 'git', ['reset', '--hard', 'origin/master'])

// Overwrite the local repository's tags with those found in the origin remote repository.
executeInherited(taskName, 'git', ['fetch', '--tags', '-p'])

// Ensure any new dependencies are installed.
executeInherited(taskName, 'npm', ['i'])

// Execute garbage collection upon the repository.
executeInherited(taskName, 'git', ['gc'])

// Report the task's success.
success(taskName)
