#!/usr/bin/env node

// Load runtime modules.
require('./verify_cwd')
require('./promise')

// Apply a hack to fix the duplication of the path environment variable in npm scripts.
const envPath = process.env.PATH
while ('path' in process.env) {
	delete process.env.PATH
}
process.env.PATH = envPath

// Requires the module, whose name is contained in the first parameter.
require(process.argv[2])
