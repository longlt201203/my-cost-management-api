import { AccountRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import {
	CheckExistsAccountField,
	CheckExistsAccountRequest,
	CreateAccountRequest,
} from "./dto";
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
			this.checkExists({
				field: CheckExistsAccountField.EMAIL,
				value: dto.email,
			}),
			this.checkExists({
				field: CheckExistsAccountField.PHONE,
				value: dto.phone,
			}),
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

	async create(dto: CreateAccountRequest) {
		await this.validateBeforeCreate(dto);
		return await this.accountRepository.save({
			email: dto.email,
			password: await bcrypt.hash(dto.password, 10),
			phone: dto.phone,
		});
	}

	async checkExists(dto: CheckExistsAccountRequest) {
		const count = await this.accountRepository.count({
			where: {
				[dto.field]: dto.value,
			},
		});
		return count > 0;
	}
}
