// Load local modules.
const {
	executeInherited,
	isFirstTimePublicAccessPublish,
	isNpmPackage,
	isScriptDefined,
	success,
} = require('../common')

// Define the current task name.
const taskName = 'POSTVERSION'

// Ensure all newly created commits and tags are pushed to the origin remote repository.
executeInherited(taskName, 'git', ['push'])
executeInherited(taskName, 'git', ['push', '--tags'])

// Determine whether the current project is an npm package.
if (isNpmPackage()) {
	// Define the process arguments to be used.
	const processArguments = ['publish']

	// Determine whether the npm package is being published with public accessibility for the first time.
	if (isFirstTimePublicAccessPublish()) {
		processArguments.push('--access=public')
	}

	// Publish the package to the npm repository.
	executeInherited(taskName, 'npm', processArguments)
} else {
	// Check whether a publish script is defined.
	if (isScriptDefined('publish')) {
		// Execute the publish script.
		executeInherited(taskName, 'npm', ['run', 'publish'])
	}
}

// Report the task's success.
success(taskName)
