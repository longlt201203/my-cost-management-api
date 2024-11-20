import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { BasicLoginRequest, ProfileResponse } from "./dto";
import { ApiResponseDto } from "@utils";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SkipAuth } from "./skip-auth.decorator";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("basic")
	@SkipAuth()
	async basicLogin(@Body() dto: BasicLoginRequest) {
		const data = await this.authService.basicLogin(dto);
		return new ApiResponseDto(data, null, "Success!");
	}

	@Get("profile")
	@ApiBearerAuth()
	profile() {
		const data = this.authService.getCurrentAccount();
		return new ApiResponseDto(
			ProfileResponse.fromEntity(data),
			null,
			"Success!",
		);
	}
}
