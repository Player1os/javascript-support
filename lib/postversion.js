// Load local modules.
const {
	execute,
	isFirstTimePublicAccessPublish,
	isNpmPackage,
	isScriptDefined,
	success,
} = require('./common')

// Ensure all newly created commits are pushed to the origin remote repository.
execute('POSTVERSION', 'git', ['push'])

// Ensure all newly created tags are pushed to the origin remote repository.
execute('POSTVERSION', 'git', ['push', '--tags'])

// Determine whether the current project is an npm package.
if (isNpmPackage()) {
	// Define the process arguments to be used.
	const processArguments = ['publish']

	// Determine whether the npm package is being published with public accessibility for the first time.
	if (isFirstTimePublicAccessPublish()) {
		processArguments.push('--access=public')
	}

	// Publish the package to the npm repository.
	execute('POSTVERSION', 'npm', processArguments)
} else {
	// Check whether a publish script is defined.
	if (isScriptDefined('publish')) {
		// Execute the publish script.
		execute('POSTVERSION', 'npm', ['run', 'publish'])
	}
}

// Report success.
success('POSTVERSION')
