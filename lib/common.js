// Load npm modules.
const colors = require('colors')

// Load node modules.
const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Load the package configuration.
const loadPackageConfiguration = () => {
	return JSON.parse(fs.readFileSync(path.join('.', 'package.json'), 'utf-8'))
}

// Report a successful task execution.
module.exports.success = (taskName) => {
	console.log( // eslint-disable-line no-console
		colors.reset.bgGreen.black(` ${taskName} `),
		colors.reset.green('has ended successfully.'))
}

// Report a failed task execution.
module.exports.failure = (taskName) => {
	console.log( // eslint-disable-line no-console
		colors.reset.bgRed.black(` ${taskName} `),
		colors.reset.red('has failed.'))
}

// Report a task notification.
module.exports.notify = (taskName, message) => {
	console.log( // eslint-disable-line no-console
		colors.reset.bgWhite.black(` ${taskName} `),
		colors.reset(message))
}

// Verify the sub-process's result and handle any encountered error.
const verifySubprocessResult = (taskName, command, processArguments, result) => {
	// Check whether the sub-process has failed.
	if (result.status !== 0) {
		// Create the initial message.
		const message = [
			`The sub-process exited with the status code: ${result.status}`,
			` - command: ${command}`,
		]

		// If any arguments are passed, include them in the message.
		if (processArguments.length > 0) {
			message.push(` - arguments: ${processArguments.join(' ')}`)
		}

		// If the stdout stream was buffered, include it's contents in the message.
		if (result.stdout !== null) {
			message.push(`- stdout: ${result.stdout}`)
		}

		// If the stderr stream was buffered, include it's contents in the message.
		if (result.stderr !== null) {
			message.push(`- stderr: ${result.stderr}`)
		}

		// Report the sub process execution details.
		console.error(message.join('\n')) // eslint-disable-line no-console

		// Report the task's failure.
		module.exports.failure(taskName)

		// Exit the current process.
		process.exit(-1)
	}
}

// Expose the common synchronous command executor with inherited stdio.
module.exports.executeInherited = (taskName, command, processArguments = [], isResultVerificationSuppressed = false) => {
	// Run the application in a separate shell and make it inherit the current process's stdio streams.
	const result = spawnSync(command, processArguments, { shell: true, stdio: 'inherit' })

	// Process the sub-process's result and check for errors.
	if (isResultVerificationSuppressed === false) {
		verifySubprocessResult(taskName, command, processArguments, result)
	}
}

// Expose the common synchronous command executor with piped stdio, the content of which is returned.
module.exports.executePiped = (taskName, command, processArguments = [], isResultVerificationSuppressed = false) => {
	// Run the application in a separate shell and make it buffer the process's stdio streams and encode them to utf-8.
	const result = spawnSync(command, processArguments, { shell: true, stdio: 'pipe', encoding: 'utf-8' })

	// Process the sub-process's result and check for errors.
	if (isResultVerificationSuppressed === false) {
		verifySubprocessResult(taskName, command, processArguments, result)
	}

	// Return the buffered and encoded stdout and stderr streams of the sub-process.
	return {
		stdout: result.stdout,
		stderr: result.stderr,
	}
}

// Determine whether the current project is being published for the first time as an npm package.
module.exports.isFirstTimePublicAccessPublish = () => {
	// Load the package configuration file.
	const packageConfiguration = loadPackageConfiguration()

	// Verify the version and private flag in the configuration.
	return (packageConfiguration.version === '0.0.0') && (packageConfiguration.private === false)
}

// Determine whether the current project is an npm package.
module.exports.isNpmPackage = () => {
	return fs.existsSync(path.join('.', '.npmignore'))
}

// Determine whether the current project has a script with the given name defined.
module.exports.isScriptDefined = (name) => {
	// Load the package configuration file.
	const packageConfiguration = loadPackageConfiguration()

	// Check whether the scripts property in the configuration contains a key with the given name.
	return (packageConfiguration.scripts !== undefined) && (packageConfiguration.scripts[name] !== undefined)
}
