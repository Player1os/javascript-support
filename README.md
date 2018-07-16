# Javascript Support

[![License](https://img.shields.io/github/license/Player1os/javascript-support.svg)](https://github.com/Player1os/javascript-support/blob/master/LICENSE)
[![NodeJS version](https://img.shields.io/node/v/@player1os/javascript-support.svg?label=node%20version)](https://nodejs.org/dist/v10.6.0/)
[![GitHub tag](https://img.shields.io/github/tag/Player1os/javascript-support.svg?label=version)](https://github.com/Player1os/javascript-support/releases)
[![Build Status](https://travis-ci.org/Player1os/javascript-support.svg?branch=master)](https://travis-ci.org/Player1os/javascript-support)

A base configuration for Javascript projects.

Provides the following development assets:

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


This project also contains some common utilities that can be reused in other similar support packages.
