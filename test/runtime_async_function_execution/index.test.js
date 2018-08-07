// Load local modules.
const common = require('.../lib')

// Load node modules.
const path = require('path')

// Store the piped async child process function.
const spawnPipedChildProcessAsync = common.spawnChildProcessAsync.piped

// Load the test runtime.
beforeAll(() => {
	require('.../lib/runtime/jest')
})

test('Ordinary async function', (done) => {
	(async () => {
		await Promise.delay(100)

		await Promise.delay(100)

		done()
	})()
})

test('Ordinary async function with callback', async () => {
	(async () => {
		await Promise.delay(100)

		return true
	})().then((result) => {
		expect(result).toBe(true)
	})
})

test('Async function with error', async () => {
	const result = await spawnPipedChildProcessAsync(
		'TEST RUN', 'node', [path.join(__dirname, 'never_ending_application.js')], true)

	expect(result.statusCode).toBe(1)
})

test('Async function with error and callback', async () => {
	let storedErr = null

	;(async () => {
		await Promise.delay(100)

		storedErr = new Error()
		throw storedErr
	})().catch((err) => {
		expect(err).toBe(storedErr)
	})
})

test('Nested async function with error', async () => {
	const result = await spawnPipedChildProcessAsync(
		'TEST RUN', 'node', [path.join(__dirname, 'nested_never_ending_application.js')], true)

	expect(result.statusCode).toBe(1)
})
