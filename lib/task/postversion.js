// Load local modules.
const { success } = require('../common/format')
const {
	isFirstTimePublicAccessPublish,
	isNpmPackage,
	isScriptDefined,
} = require('../common/package_configuration')
const { inherited: spawnChildProcessInherited } = require('../common/spawn_child_process')

// Define the current task name.
const taskName = 'POSTVERSION'

;(async () => {
	// Ensure all newly created commits and tags are pushed to the origin remote repository.
	await spawnChildProcessInherited(taskName, 'git', ['push'])
	await spawnChildProcessInherited(taskName, 'git', ['push', '--tags'])

	// Determine whether the current project is an npm package.
	if (isNpmPackage()) {
		// Define the process arguments to be used.
		const processArguments = ['publish']

		// Determine whether the npm package is being published with public accessibility for the first time.
		if (isFirstTimePublicAccessPublish()) {
			processArguments.push('--access=public')
		}

		// Publish the package to the npm repository.
		await spawnChildProcessInherited(taskName, 'npm', processArguments)
	} else {
		// Check whether a publish script is defined.
		if (isScriptDefined('publish')) {
			// Execute the publish script.
			await spawnChildProcessInherited(taskName, 'npm', ['run', 'publish'])
		}
	}

	// Report the task's success.
	success(taskName)
})()
