// Load local modules.
const common = require('.../lib')

// Load node modules.
const fs = require('fs')
const os = require('os')
const path = require('path')

// Store the piped async child process function.
const spawnPipedChildProcessAsync = common.spawnChildProcessAsync.piped

// Store the expected results for the failing application.
const failingApplicationResults = JSON.parse(fs.readFileSync(path.join(__dirname, 'failing_application_result.json'), 'utf-8'))

// Load the test runtime.
beforeAll(() => {
	require('.../lib/runtime/jest')
})

test('Basic echo [pipe stdio]', async () => {
	const result = await spawnPipedChildProcessAsync('TEST RUN', 'echo', ['Hello world!'])

	expect(result).toEqual({
		statusCode: 0,
		killSignal: null,
		stdout: `Hello world!${os.EOL}`,
		stderr: '',
	})
})

test('Basic echo [inherit stdio]', async () => {
	const result = await spawnPipedChildProcessAsync(
		'TEST RUN', 'node', [path.join(__dirname, 'basic_echo_inherited_stdio.js')])

	expect(result).toEqual({
		statusCode: 0,
		killSignal: null,
		stdout: `Hello world!${os.EOL}`,
		stderr: '',
	})
})

test('To lower case transformer [input test]', async () => {
	const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')

	const result = await spawnPipedChildProcessAsync(
		'TEST RUN', 'node', [path.join(__dirname, 'to_lower_case.js'), '<', path.join(__dirname, 'input.txt')])

	expect(result).toEqual({
		statusCode: 0,
		killSignal: null,
		stdout: input.toLowerCase(),
		stderr: '',
	})
})

test('Incorrect application name', async () => {
	const result = await spawnPipedChildProcessAsync('TEST RUN', "echo_echo_i_don't_exist", ['Hello world!'], true)

	expect(result.statusCode).not.toBe(0)
	expect(result.killSignal).toBe(null)
})

test('Failing application [Error on non-zero]', async () => {
	const result = await spawnPipedChildProcessAsync(
		'TEST RUN', 'node', [path.join(__dirname, 'exiting_on_error_inherited_stdio.js')], true)

	expect(result.statusCode).not.toBe(0)
	expect(result.killSignal).toBe(null)
	expect(result.stdout).toEqual(expect.stringMatching(new RegExp(`^${failingApplicationResults.stdout}`)))
	expect(result.stderr).toEqual(expect.stringMatching(new RegExp(`^${failingApplicationResults.stderr}`)))
})

test('Failing application [Verification is suppressed]', async () => {
	const result = await spawnPipedChildProcessAsync(
		'TEST RUN', 'node', [
			path.join(__dirname, 'returns_plus_one.js'), failingApplicationResults.stdout, failingApplicationResults.stderr,
		], true)

	expect(result).toEqual(failingApplicationResults)
})
