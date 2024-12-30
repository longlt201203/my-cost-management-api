import { ApiError } from "@errors";

export class NoMonthlyFoundError extends ApiError {
	constructor() {
		super({
			code: "no_monthly_analysis_err",
			message: "No monthly analysis found",
			status: 400,
			detail: null,
		});
	}
}
