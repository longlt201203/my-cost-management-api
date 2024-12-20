import { ApiError } from "@errors";

export class InvalidCallbackUriError extends ApiError {
	constructor() {
		super({
			code: "invalid_callback_uri_err",
			message: "Invalid callback URI",
			status: 400,
			detail: null,
		});
	}
}
