// Load runtime modules.
require('../../lib/runtime')

// Load node modules.
const { Transform } = require('stream')

// Define a transform stream that converts all input to lower case.
class ToLowerCaseTransform extends Transform {
	_transform (chunk, _encoding, done) {
		done(null, chunk.toString().toLowerCase())
	}
}

// Pipe the process input stream into it's output stream through an instance of the transform stream.
process.stdin
	.pipe(new ToLowerCaseTransform())
	.pipe(process.stdout)
