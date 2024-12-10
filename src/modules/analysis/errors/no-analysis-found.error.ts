import { ApiError } from "@errors";

export class NoAnalysisFoundError extends ApiError {
	constructor() {
		super({
			code: "no_analysis_found_err",
			message: "No analysis found",
			detail: null,
		});
	}
}
