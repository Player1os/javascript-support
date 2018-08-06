// Load runtime modules.
require('./verify_cwd')

// Load npm modules.
const moduleAlias = require('module-alias')

// Setup module-alias to properly load non-relative local modules.
moduleAlias.addAlias('...', process.cwd())
