import { ApiError } from "@errors";

export class NoYearlyFoundError extends ApiError {
	constructor() {
		super({
			code: "no_yearly_analysis_err",
			message: "No yearly analysis found",
			status: 400,
			detail: null,
		});
	}
}
