# Javascript Support

[![License](https://img.shields.io/github/license/Player1os/javascript-support.svg)](https://github.com/Player1os/javascript-support/blob/master/LICENSE)
[![NodeJS version](https://img.shields.io/node/v/@player1os/javascript-support.svg?label=node%20version)](https://nodejs.org/dist/v10.6.0/)
[![GitHub tag](https://img.shields.io/github/tag/Player1os/javascript-support.svg?label=version)](https://github.com/Player1os/javascript-support/releases)
[![Build Status](https://travis-ci.org/Player1os/javascript-support.svg?branch=master)](https://travis-ci.org/Player1os/javascript-support)

A set of common utilities and scripts to be used in the development of projects written in Javascript.

This project provides the following development assets:

- `.eslintrc.json` - a common linter configuration file for *eslint*.
- `lib/version/pre.js` - a script that is executed *before* the project's version is to be updated:

	1. Ensures the newest version of the master branch is checked out, by running:

		```
		git checkout master
		git pull
		```

	1. Ensures all the dependencies are installed, by running:

		```
		npm i
		```

	1. Executes the test script, if it is defined, by running:

		```
		npm test
		```

- `lib/version/post.js` - a script that is executed *after* the project's version has been updated:

	1. Pushes any new commits and tags to the `origin` remote repository, by running:

		```
		git push
		git push --tags
		```

	1. Determines whether the current project is an *npm package*, by checking the contents of the `.npmignore` and `package-json` files.

	1. If the current project is an *npm package* it is published to **npm**, by running:

		```
		npm publish
		```

		Alternatively, if the project is publicly accessible and is being published for the first time, by running:

		```
		npm publish --access=public
		```

	1. If the current project isn't an *npm package* but a `publish` script is defined in the `package.json` file,
	then this script is executed, by running:

		```
		npm run publish
		```

- `lib/update_base/create.js` - a script that creates a rebased tree of the git repository of a project derived from a template project,
when the template is modified:

	1. We assume all **tags** are located on the path between the `master` branch and the repository's root. Thus we'll need to
	reapply these tags to newly created commits, after the rebase is finished. For each tag, store a mapping from the tag's commit
	message to the tag's name.

	1. Fetch the `base` remote repository's branches, by running:

		```
		git fetch base
		```

	1. Make sure we're in the project's `master` branch, by running:

		```
		git checkout master
		```

	1. Rebase the project's `master` branch to the `base` remote repository's `master` branch, by running:

		```
		git rebase base/master
		```

		The rebase may require some manual intervention. In this case the script will spawn a new nested shell instance.
		We are instructed to close this instance once the rebase is complete.

	1. For each commit on the path from the newly rebased `master` commit to the repository's root, we check if its message
	can be found in the mapping previously stored at the first step. If a match is found, the tag is moved to the new commit, by running:

		```
		git tag -af TAG_NAME NEW_COMMIT_HASH
		```

	1. Ensures any new dependencies are installed, by running:

		```
		npm i
		```

	1. Execute garbage collection upon the repository, by running:

		```
		git gc
		```

	1. Propagate the changes to the `origin` remote repository, by running:

		```
		git push -f
		git push --tags -f
		```

- `lib/update_base/load.js` - a script that loads the rebased tree of the git repository from the `origin` remote repository:

	1. Fetch the `origin` remote repository's branches, by running:

		```
		git fetch
		```

	1. Fetch the `base` remote repository's branches, by running:

		```
		git fetch base
		```

	1. Make sure we are in the project's `master` branch, by running:

		```
		git checkout master
		```

	1. Make a hard reset of the `master` branch to where the `origin` remote repository's `master` branch is located, by running:

		```
		git reset --hard origin/master
		```

	1. Overwrite the local repository's tags with those found in the `origin` remote repository, by running:

		```
		git fetch --tags -p
		```

	1. Ensures any new dependencies are installed, by running:

		```
		npm i
		```

	1. Execute garbage collection upon the repository, by running:

		```
		git gc
		```

## JS NPM Package Support

"description": "A set of common utilities and scripts to be used in the development of an NPM package projects written in Javascript",

[![License](https://img.shields.io/github/license/Player1os/js-npm-package-support.svg)](https://github.com/Player1os/js-npm-package-support/blob/master/LICENSE)
[![NodeJS version](https://img.shields.io/node/v/@player1os/js-npm-package-support.svg?label=node%20version)](https://nodejs.org/dist/v10.6.0/)
[![GitHub tag](https://img.shields.io/github/tag/Player1os/js-npm-package-support.svg?label=version)](https://github.com/Player1os/js-npm-package-support/releases)
[![Build Status](https://travis-ci.org/Player1os/js-npm-package-support.svg?branch=master)](https://travis-ci.org/Player1os/js-npm-package-support) [![Greenkeeper badge](https://badges.greenkeeper.io/Player1os/javascript-support.svg)](https://greenkeeper.io/)

A set of common utilities and scripts to be used in the development of NPM package projects written in Javascript.

This project provides the following development assets:

- `lib/test.js` - a script that is intended as the project's *test* task script:

	1. Execute the *eslint* linter, by running:

		```
		eslint .
		```

	1. Determine whether the current project contains any tests, by verifying the existence of the `./test` directory.

	1. If the current project is found to contain tests, execute the *jest* test runner, by running:

		```
		jest
		```

This project inherits development assets from the following projects:

- [@player1os/javascript-support](https://github.com/Player1os/javascript-support)

## NodeJS Execute Async Function

"description": "A small library that streamlines the direct execution of async functions",

A small library that streamlines the direct execution of async functions

There are three benefits that come from using this library:
1. The passed async function is immediatly executed.
1. If the async function fails and no callback is supplied, the error will be thrown outside of the function. This will result in
an `UncaughtExecption` instead of an `UnhandledRejection`. In my usecase, having the application crash on error is preferred.
1. The async function is executed outside of the context of any enclosing async function, thus errors are not caught by the
enclosing function.

It is possible to supply a callback which is executed after the async function is finished. The callback follows the classic nodejs
parameter convention `(err: Error | null, result: any)`

## NodeJS Spawn Process Async

"description": "A promise wrapper of the standard Node.js library for spawning a process",

A promise wrapper of the standard Node.js library for spawning a process.

```javascript
const { default: spawnProcessAsync } = require('@player1os/spawn-process-async')

const result = await spawnProcessAsync('echo', ['"Hello World!"'])

console.log(result.outStreamData) // outputs: Hello World!
```

The implementation is designed similarly to `childProcess.spawnSync` in that it does not allow any interaction with the spawned process
until it has exited. The difference is that since this is an asynchronous implementation, the process does not block.

The implementation forces the process to be spawned in a separate shell (which is slower, but simplifies cross-platform usage).

By default the process's output and error streams are buffered and transformed to `utf-8` strings, contained in the return value. By
setting the optional parameter `options.isStdioInherited` to `true`, the child's streams are forwarded to the parent process.

Finally the function throws a `ProcessError` Error object if the process returns with a non-zero status code. This Error object contains
information about the process. This behavior can be disabled by setting the optional parameter
`options.isErrorOnNonZeroStatusCodeSuppressed` to `true`.
