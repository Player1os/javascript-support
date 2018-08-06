// Load node modules.
const fs = require('fs')

// Make sure the task is run with the current working directory containing a package.json file.
if (!fs.existsSync('package.json')) {
	// Report the error.
	console.log('The current working directory does not contain a "package.json" file') // eslint-disable-line no-console

	// Exit the current process with a non-zero code.
	process.exit(-1)
}
