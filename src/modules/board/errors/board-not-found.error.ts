import { ApiError } from "@errors";

export class BoardNotFoundError extends ApiError {
	constructor() {
		super({
			code: "board_not_found_err",
			message: "Board not found",
			detail: null,
			status: 404,
		});
	}
}
