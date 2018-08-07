// Load runtime modules.
require('../../lib/runtime')

// Write the arguments to the out and err streams.
process.stdout.write(process.argv[2])
process.stderr.write(process.argv[3])

// Set the exit code to one.
process.exitCode = 1
