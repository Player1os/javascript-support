// Load local modules.
const {
	notify,
	success,
} = require('../../common/format')
const spawnChildProcess = require('../../common/spawn_child_process')

// Load node modules.
const os = require('os')

// Define the current task name.
const taskName = 'UPDATE BASE: CREATE'

;(async () => {
	// Print out all the tag refs' commit hashes.
	const { stdout: tagRefCommitHashesOutput } = await spawnChildProcess.piped(taskName, 'git', ['show-ref', '--tags'], true)

	// Create an original commit hash to tag name array.
	const originalCommitHashToTagName = tagRefCommitHashesOutput
		.split('\n')
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
		})

	// Create a commit message to tag name map.
	const commitMessageToTagNameMap = new Map()
	for (const [originalCommitHash, tagName] of originalCommitHashToTagName) {
		// Print out the tag's commit messages.
		const { stdout: tagCommitMessagesOutput } = await spawnChildProcess.piped(taskName,
			'git', ['--no-pager', 'show', '-s', '--format=%s', originalCommitHash])

		const commitMessages = tagCommitMessagesOutput
			.split('\n')
			.filter((line) => {
				return line.length > 0
			})

		commitMessageToTagNameMap.set(commitMessages.pop(), tagName)
	}

	// Fetch the base remote repository's branches.
	await spawnChildProcess.inherited(taskName, 'git', ['fetch', 'base'])

	// Make sure we are in the project's master branch.
	await spawnChildProcess.inherited(taskName, 'git', ['checkout', 'master'])

	// Rebase the project's master branch to the base remote repository's master branch.
	await spawnChildProcess.inherited(taskName, 'git', ['rebase', 'base/master'], true)

	// Determine the platform's default shell.
	const defaultShell = (os.platform() === 'win32')
		? 'cmd'
		: 'bash'

	// Loop until the rebase is finished or aborted.
	while ((await spawnChildProcess.piped(taskName, 'git', ['status'])).stdout.substr(0, 18) === 'rebase in progress') {
		// Notify the user of the instructions to follow.
		notify(taskName, 'follow the rebase instructions and when done enter the `exit` command, to continue.')

		// Execute the nested shell.
		await spawnChildProcess.inherited(taskName, defaultShell)
	}

	// Load all commits with their messages.
	const newCommitShortHashToMessage = (await spawnChildProcess.piped(taskName, 'git', ['log', '--no-decorate', '--oneline']))
		.stdout.split('\n')
		.filter((line) => {
			return line.length > 0
		})
		.map((line) => {
			return line.split(' ')
		})

	// Find commits that need to have their tags reapplied, based on a commit message match.
	for (const [newCommitShortHash, commitMessage] of newCommitShortHashToMessage) {
		const tagName = commitMessageToTagNameMap.get(commitMessage)
		if (tagName !== undefined) {
			await spawnChildProcess.inherited(taskName, 'git', ['tag', '-d', tagName])
			console.log(`Recreated tag '${tagName}' at commit '${newCommitShortHash}')`) // eslint-disable-line no-console
			await spawnChildProcess.inherited(taskName, 'git', ['tag', tagName, newCommitShortHash])
		}
	}

	// Ensure any new dependencies are installed.
	await spawnChildProcess.inherited(taskName, 'npm', ['i'])

	// Execute garbage collection upon the repository.
	await spawnChildProcess.inherited(taskName, 'git', ['gc'])

	// Propagate the changes to the origin remote repository.
	await spawnChildProcess.inherited(taskName, 'git', ['push', '-f'])
	await spawnChildProcess.inherited(taskName, 'git', ['push', '--tags', '-f'])

	// Report the task's success.
	success(taskName)
})()
