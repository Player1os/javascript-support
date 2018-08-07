export const inherited: (
	taskName: string,
	command: string,
	processArguments: string[],
	isResultVerificationSuppressed: boolean,
) => {
	statusCode: number,
	killSignal: string | number | null,
	stdout: null,
	stderr: null,
}

export const piped: (
	taskName: string,
	command: string,
	processArguments: string[],
	isResultVerificationSuppressed: boolean,
) => {
	statusCode: number,
	killSignal: string | number | null,
	stdout: string,
	stderr: string,
}
