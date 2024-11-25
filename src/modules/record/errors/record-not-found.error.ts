import { ApiError } from "@errors";

export class RecordNotFoundError extends ApiError {
	constructor() {
		super({
			code: "record_not_found_err",
			detail: null,
			message: "Record not found!",
			status: 404,
		});
	}
}
