// Load local modules.
const { failure } = require('./format')

// Load node modules.
const { spawn } = require('child_process')

// Verify the child process's result and handle any encountered error.
const verifyChildProcessResult = (
	taskName,
	command,
	processArguments,
	result,
) => {
	// Check whether the child process has failed.
	if (result.statusCode !== 0) {
		// Report the child process execution details.
		console.error([ // eslint-disable-line no-console
			// Create the initial message.
			`The child process exited with the status code: ${result.statusCode}`,
			` - command: "${command}"`,
			// If any arguments are passed, include them in the message.
			` - arguments: ${
				(processArguments.length === 0)
					? 'null'
					: `"${processArguments.join('", "')}"`
			}`,
			// If a kill signal was used to terminate the process, include it in the message.
			` - kill signal: ${
				(result.killSignal === null)
					? 'null'
					: `"${result.killSignal}"`
			}`,
			// If the stdout stream was buffered, include it's contents in the message.
			` - stdout: ${
				(result.stdout === null)
					? 'null'
					: `"${result.stdout}"`
			}`,
			// If the stderr stream was buffered, include it's contents in the message.
			` - stderr: ${
				(result.stderr === null)
					? 'null'
					: `"${result.stderr}"`
			}`,
		].join('\n'))

		// Report the task's failure.
		failure(taskName)

		// Exit the current process.
		process.exit(-1)
	}
}

// Define the promise generator.
const spawnChildProcess = (
	taskName,
	command,
	processArguments,
	stdio,
	isResultVerificationSuppressed,
) => {
	// Define variables for collecting standard stream data.
	const isStdioInherited = stdio === 'inherit'
	let stdout = isStdioInherited
		? null
		: ''
	let stderr = isStdioInherited
		? null
		: ''

	// Define the out stream data aggregator function.
	const stdoutHandler = (data) => {
		stdout += data
	}

	// Define the err stream data aggregator function.
	const stderrHandler = (data) => {
		stderr += data
	}

	// Return the promise wrapper.
	return new Promise((resolve, reject) => {
		// Spawn the command in a separate shell with the given arguments.
		const childProcess = spawn(command, processArguments, {
			shell: true,
			stdio,
		})

		// Define the child process error handler.
		childProcess.on('error', (err) => {
			// Set the error properties.
			err.data = {
				taskName,
				command,
				processArguments,
				stdout,
				stderr,
			}

			// Reject the promise with the given error.
			reject(err)
		})

		// Define the child process close handler.
		childProcess.on('close', (statusCode, killSignal) => {
			// Define the result object.
			const result = {
				statusCode,
				killSignal,
				stdout,
				stderr,
			}

			// Process the sub-process's result and check for errors.
			if (isResultVerificationSuppressed === false) {
				verifyChildProcessResult(taskName, command, processArguments, result)
			}

			// Resolve the promise with the result.
			resolve(result)
		})

		// Optionally set the aggregator handler for the stdout stream, if it is available.
		if (childProcess.stdout !== null) {
			childProcess.stdout.on('data', stdoutHandler)
		}

		// Optionally set the aggregator handler for the stderr stream, if it is available.
		if (childProcess.stderr !== null) {
			childProcess.stderr.on('data', stderrHandler)
		}
	})
}

// Expose the common asynchronous command executor with inherited stdio.
exports.inherited = (
	taskName,
	command,
	processArguments = [],
	isResultVerificationSuppressed = false,
) => {
	// Run the application and make it inherit the current process's stdio streams and return the result.
	return spawnChildProcess(taskName, command, processArguments, 'inherit', isResultVerificationSuppressed)
}

// Expose the common asynchronous command executor with piped stdio, the content of which is returned.
exports.piped = (
	taskName,
	command,
	processArguments = [],
	isResultVerificationSuppressed = false,
) => {
	// Run the application and make it buffer the process's stdio streams and encode them to utf-8 and return the result.
	return spawnChildProcess(taskName, command, processArguments, 'pipe', isResultVerificationSuppressed)
}
