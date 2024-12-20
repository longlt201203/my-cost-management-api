import { Body, Controller, Post } from "@nestjs/common";
import { AccountService } from "./account.service";
import { CheckExistsAccountRequest, CreateAccountRequest } from "./dto";
import { ApiResponseDto } from "@utils";
import { ApiTags } from "@nestjs/swagger";
import { SkipAuth } from "@modules/auth";

@Controller("account")
@ApiTags("account")
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@Post()
	@SkipAuth()
	async create(@Body() dto: CreateAccountRequest) {
		const data = await this.accountService.create(dto);
		return new ApiResponseDto(data, null, "Success!");
	}

	@Post("exists")
	@SkipAuth()
	async checkExists(@Body() dto: CheckExistsAccountRequest) {
		const data = await this.accountService.checkExists(dto);
		return new ApiResponseDto(data, null, "Success!");
	}
}
