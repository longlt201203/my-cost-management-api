import { AccountRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { CreateAccountRequest } from "./dto";
import * as bcrypt from "bcrypt";
import { ValidationError } from "class-validator";
import { ApiValidationError } from "@errors";
import { ClassTracing } from "magic-otel";

@Injectable()
@ClassTracing()
export class AccountService {
	constructor(private readonly accountRepository: AccountRepository) {}

	async validateBeforeCreate(dto: CreateAccountRequest) {
		const errors = [];
		const [isEmailExists, isPhoneExists] = await Promise.all([
			this.isEmailExists(dto.email),
			this.isPhoneExists(dto.phone),
		]);

		if (isEmailExists) {
			const error = new ValidationError();
			error.property = "email";
			error.constraints = {
				isEmailExists: "Email already exists",
			};
			errors.push(error);
		}

		if (isPhoneExists) {
			const error = new ValidationError();
			error.property = "phone";
			error.constraints = {
				isPhoneExists: "Phone already exists",
			};
			errors.push(error);
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	async isEmailExists(email: string, accountId?: number) {
		const count = await this.accountRepository.count({
			where: {
				email: email,
				id: accountId,
			},
		});
		return count > 0;
	}

	async isPhoneExists(phone: string, accountId?: number) {
		const count = await this.accountRepository.count({
			where: {
				phone: phone,
				id: accountId,
			},
		});
		return count > 0;
	}

	async create(dto: CreateAccountRequest) {
		await this.validateBeforeCreate(dto);
		return await this.accountRepository.save({
			email: dto.email,
			password: await bcrypt.hash(dto.password, 10),
			phone: dto.phone,
		});
	}
}
