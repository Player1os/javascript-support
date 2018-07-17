// Load local modules.
const {
	executePiped,
	executeInherited,
	notify,
	success,
} = require('../common')

// Load node modules.
const os = require('os')

// Define the current task name.
const taskName = 'UPDATE BASE: CREATE'

// Create an original commit hash to tag name map.
const originalCommitHashToTagNameMap = new Map(
	// Print out all the tag refs' commit hashes.
	executePiped(taskName, 'git', ['show-ref', '--tags'])
		.stdout.split('\n')
		.filter((line) => {
			return line.length > 0
		})
		.map((line) => {
			const [
				originalCommitHash,
				referenceName,
			] = line.split(' ')

			return [
				originalCommitHash,
				referenceName.substring(10),
			]
		}))

// Create a commit message to tag name map.
const commitMessageToTagNameMap = new Map(
	[...originalCommitHashToTagNameMap]
		.map(([originalCommitHash, tagName]) => {
			// Print out the tag's commit messages.
			const commitMessages = executePiped(taskName, 'git', ['--no-pager', 'show', '-s', '--format=%s', originalCommitHash])
				.stdout.split('\n')
				.filter((line) => {
					return line.length > 0
				})

			return [
				commitMessages.pop(),
				tagName,
			]
		}))

// Fetch the base remote repository's branches.
executeInherited(taskName, 'git', ['fetch', 'base'])

// Make sure we are in the project's master branch.
executeInherited(taskName, 'git', ['checkout', 'master'])

// Rebase the project's master branch to the base remote repository's master branch.
executeInherited(taskName, 'git', ['rebase', 'base/master'], true)

// Determine the platform's default shell.
const defaultShell = (os.platform() === 'win32')
	? 'cmd'
	: 'bash'

// Loop until the rebase is finished or aborted.
while (executePiped(taskName, 'git', ['status']).stdout.substr(0, 18) === 'rebase in progress') {
	// Notify the user of the instructions to follow.
	notify(taskName, 'follow the rebase instructions and when done enter the `exit` command, to continue.')

	// Execute the nested shell.
	executeInherited(taskName, defaultShell)
}

// Load all commits and find those that need to have their tags reapplied, based on a commit message match.
executePiped(taskName, 'git', ['log', '--no-decorate', '--oneline'])
	.stdout.split('\n')
	.filter((line) => {
		return line.length > 0
	})
	.forEach((line) => {
		const [
			newCommitShortHash,
			commitMessage,
		] = line.split(' ')

		const tagName = commitMessageToTagNameMap.get(commitMessage)
		if (tagName !== undefined) {
			executeInherited(taskName, 'git', ['tag', '-d', tagName])
			console.log(`Recreated tag '${tagName}' at commit '${newCommitShortHash}')`) // eslint-disable-line no-console
			executeInherited(taskName, 'git', ['tag', tagName, newCommitShortHash])
		}
	})

// Ensure any new dependencies are installed.
executeInherited(taskName, 'npm', ['i'])

// Execute garbage collection upon the repository.
executeInherited(taskName, 'git', ['gc'])

// Propagate the changes to the origin remote repository.
executeInherited(taskName, 'git', ['push', '-f'])
executeInherited(taskName, 'git', ['push', '--tags', '-f'])

// Report the task's success.
success(taskName)
