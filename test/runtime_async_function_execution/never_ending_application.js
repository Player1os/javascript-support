// Load runtime modules.
require('../../lib/runtime')

// Setup the never ending loop.
setInterval(() => {
	console.log(new Date()) // eslint-disable-line no-console
}, 100)

// Execute the async function with an error.
;(async () => {
	// Wait for a few iterations of the above loop to execute.
	await Promise.delay(1000)

	// Throw an uncaught error.
	throw new Error()
})()
