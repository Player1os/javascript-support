// Load local modules.
const {
	notify,
	success,
} = require('../../common/format.js')
const {
	inherited: spawnProcessInherited,
	piped: spawnProcessPiped,
} = require('../../common/spawn_child_process_async')

// Load node modules.
const os = require('os')

// Define the current task name.
const taskName = 'UPDATE BASE: CREATE'

;(async () => {
	// Print out all the tag refs' commit hashes.
	const { stdout: tagRefCommitHashesOutput } = await spawnProcessPiped(taskName, 'git', ['show-ref', '--tags'])

	// Create an original commit hash to tag name map.
	const originalCommitHashToTagNameMap = new Map(tagRefCommitHashesOutput
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
		}))

	// Create a commit message to tag name map.
	const commitMessageToTagNameMap = new Map(await Promise.all([...originalCommitHashToTagNameMap]
		.map(async ([originalCommitHash, tagName]) => {
			// Print out the tag's commit messages.
			const { stdout: tagCommitMessagesOutput } = await spawnProcessPiped(taskName,
				'git', ['--no-pager', 'show', '-s', '--format=%s', originalCommitHash])

			const commitMessages = tagCommitMessagesOutput
				.split('\n')
				.filter((line) => {
					return line.length > 0
				})

			return [
				commitMessages.pop(),
				tagName,
			]
		})))

	// Fetch the base remote repository's branches.
	await spawnProcessInherited(taskName, 'git', ['fetch', 'base'])

	// Make sure we are in the project's master branch.
	await spawnProcessInherited(taskName, 'git', ['checkout', 'master'])

	// Rebase the project's master branch to the base remote repository's master branch.
	await spawnProcessInherited(taskName, 'git', ['rebase', 'base/master'], true)

	// Determine the platform's default shell.
	const defaultShell = (os.platform() === 'win32')
		? 'cmd'
		: 'bash'

	// Loop until the rebase is finished or aborted.
	while ((await spawnProcessPiped(taskName, 'git', ['status']).stdout.substr(0, 18)) === 'rebase in progress') {
		// Notify the user of the instructions to follow.
		notify(taskName, 'follow the rebase instructions and when done enter the `exit` command, to continue.')

		// Execute the nested shell.
		await spawnProcessInherited(taskName, defaultShell)
	}

	// Load all commits with their messages.
	const { stdout: commitsWithMessagesOutput } = await spawnProcessPiped(taskName, 'git', ['log', '--no-decorate', '--oneline'])

	// Find commits that need to have their tags reapplied, based on a commit message match.
	await Promise.all(commitsWithMessagesOutput
		.split('\n')
		.filter((line) => {
			return line.length > 0
		})
		.map(async (line) => {
			const [
				newCommitShortHash,
				commitMessage,
			] = line.split(' ')

			const tagName = commitMessageToTagNameMap.get(commitMessage)
			if (tagName !== undefined) {
				await spawnProcessInherited(taskName, 'git', ['tag', '-d', tagName])
				console.log(`Recreated tag '${tagName}' at commit '${newCommitShortHash}')`) // eslint-disable-line no-console
				await spawnProcessInherited(taskName, 'git', ['tag', tagName, newCommitShortHash])
			}
		}))

	// Ensure any new dependencies are installed.
	await spawnProcessInherited(taskName, 'npm', ['i'])

	// Execute garbage collection upon the repository.
	await spawnProcessInherited(taskName, 'git', ['gc'])

	// Propagate the changes to the origin remote repository.
	await spawnProcessInherited(taskName, 'git', ['push', '-f'])
	await spawnProcessInherited(taskName, 'git', ['push', '--tags', '-f'])

	// Report the task's success.
	success(taskName)
})()
