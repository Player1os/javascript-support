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

// Expose the common synchronous command executor.
module.exports.execute = (name, command, processArguments = []) => {
	// Run the application in a separate shell and make it inherit the current process's stdio streams.
	const result = spawnSync(command, processArguments, { shell: true, stdio: 'inherit' })

	// Check if the executed command has failed.
	if (result.status !== 0) {
		console.log(colors.reset.bgRed.black(` ${name} `), colors.red('has failed.')) // eslint-disable-line no-console

		// Exit the current process.
		process.exit(-1)
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

// Report the successful execution.
module.exports.success = (name) => {
	console.log(colors.reset.bgGreen.black(` ${name} `), colors.green('has ended successfully.')) // eslint-disable-line no-console
}
