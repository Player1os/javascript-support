// Load node modules.
const fs = require('fs')

// Load the package configuration.
const packageConfiguration = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

// Determine whether the current project is being published for the first time as an npm package.
exports.isFirstTimePublicAccessPublish = () => {
	// Verify the version and private flag in the configuration.
	return (packageConfiguration.version === '0.0.0')
		&& (packageConfiguration.private === false)
}

// Determine whether the current project is an npm package.
exports.isNpmPackage = () => {
	return fs.existsSync('.npmignore')
}

// Determine whether the current project has a script with the given name defined.
exports.isScriptDefined = (name) => {
	// Check whether the scripts property in the configuration contains a key with the given name.
	return (packageConfiguration.scripts !== undefined)
		&& (packageConfiguration.scripts[name] !== undefined)
}
