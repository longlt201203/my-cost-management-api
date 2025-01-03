import { ApiError } from "@errors";

export class CategoryNotOwnedError extends ApiError {
	constructor() {
		super({
			code: "category_not_owned_err",
			message: "Category does not belong to the account",
			detail: null,
		});
	}
}
