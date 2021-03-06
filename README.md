# Javascript Support

[![License](https://img.shields.io/github/license/Player1os/javascript-support.svg)](https://github.com/Player1os/javascript-support/blob/master/LICENSE)
[![NodeJS version](https://img.shields.io/node/v/@player1os/javascript-support.svg?label=node%20version)](https://nodejs.org/dist/v10.15.3/)
[![GitHub tag](https://img.shields.io/github/tag/Player1os/javascript-support.svg?label=version)](https://github.com/Player1os/javascript-support/releases)
[![Build Status](https://travis-ci.org/Player1os/javascript-support.svg?branch=master)](https://travis-ci.org/Player1os/javascript-support)
[![Greenkeeper badge](https://badges.greenkeeper.io/Player1os/javascript-support.svg)](https://greenkeeper.io/)

A set of common utilities and scripts to be used in the development of projects written in Javascript.

## Assets

This project provides the following development assets:

### Eslint configuration

`.eslintrc.json` - a common linter configuration file for *eslint*.

### Output formatting

`lib/common/format.js` - a module that exports functions for outputting standardized messages:

- `success(taskName: string)` - notifies of the success of a task with the given name.
- `failure(taskName: string)` - notifies of the failure of a task with the given name.
- `notify(taskName: string, message: string)` - outputs a custom message for the a task with the given name.

### Async spawn child process

`lib/common/spawn_child_process.js` - a promise wrapper of the standard Node.js library for spawning a process.

The implementation is designed similarly to `childProcess.spawnSync` in that it does not allow any interaction with the spawned process until it has exited. The difference is that since this is an asynchronous implementation, the process does not block.

The implementation forces the process to be spawned in a separate shell (which is slower, but simplifies cross-platform usage).

The module exports functions, with the following identical parameters:

- `taskName: string` - the name of the task that triggered the function, this is only used if the process fails and result verification is not suppressed.
- `command: string` - the command to be executed.
- `processArguments: string[]` - the arguments for the command to be executed.
- `isResultVerificationSuppressed: boolean?` - an optional flag that determines whether the result of the command is to be validated internally. If set to `false`, the functions check whether the spawned process returned with a non-zero status code. If the validation fails, an error is outputted and the current process is halted with a non-zero status code. The default value of this parameter is `false`.

The functions both return an object containing the status code and kill signal as well as any buffered stdout or stderr streams.

The exported functions differ as follows:

- `inherited()` - the spawned process's IO streams are forwarded to the current process.
- `piped()` - the spawned process's IO streams are buffered and transformed to `utf-8` strings, contained in the return object.

The following is a usage example of the piped variant:

```javascript
const { spawnChildProcess } = require('@player1os/javascript-support')

;async () => {
	const result = await spawnChildProcess.piped('SCRIPT', 'echo', ['"Hello World!"'])

	console.log(result.stdout) // outputs: Hello World!
}()
```

### Preversion task script

`lib/task/preversion.js` - a script that is executed *before* the project's version is to be updated:

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

### Postversion task script

`lib/task/postversion.js` - a script that is executed *after* the project's version has been updated:

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

### Update base create task script

`lib/task/update_base/create.js` - a script that creates a rebased tree of the git repository of a project derived from a template project, when the template is modified:

1. We assume all **tags** are located on the path between the `master` branch and the repository's root. Thus we'll need to reapply these tags to newly created commits, after the rebase is finished. For each tag, store a mapping from the tag's commit message to the tag's name.

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

1. For each commit on the path from the newly rebased `master` commit to the repository's root, we check if its message can be found in the mapping previously stored at the first step. If a match is found, the tag is moved to the new commit, by running:

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

### Update base load task script

`lib/task/update_base/load.js` - a script that loads the rebased tree of the git repository from the `origin` remote repository:

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

## Tests

This project contains an `npm test` script that is triggered in the aforementioned. The script itself does the following:

1. Execute the *eslint* linter, by running:

	```
	eslint .
	```

1. If the current project is found to contain tests, execute the *jest* test runner, by running:

	```
	jest
	```
