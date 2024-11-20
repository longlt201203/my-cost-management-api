import { ApiError } from "@errors";

export class InvalidTokenError extends ApiError {
	constructor() {
		super({
			code: "invalid_token_err",
			detail: null,
			message: "Invalid token",
			status: 401,
		});
	}
}
