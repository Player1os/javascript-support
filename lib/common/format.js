// Load npm modules.
const colors = require('colors')

// Report a successful task execution.
exports.success = (taskName) => {
	console.log( // eslint-disable-line no-console
		colors.reset.bgGreen.black(`- ${taskName} -`),
		colors.reset.green('has ended successfully.'))
}

// Report a failed task execution.
exports.failure = (taskName) => {
	console.log( // eslint-disable-line no-console
		colors.reset.bgRed.black(`- ${taskName} -`),
		colors.reset.red('has failed.'))
}

// Report a task notification.
exports.notify = (taskName, message) => {
	console.log( // eslint-disable-line no-console
		colors.reset.bgYellow.black(`- ${taskName} -`),
		colors.reset.yellow(message))
}
