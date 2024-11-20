import { ApiError } from "@errors";

export class NoRecordFoundError extends ApiError {
	constructor() {
		super({
			code: "no_record_found_err",
			message: "No record found",
			status: 400,
			detail: null,
		});
	}
}
