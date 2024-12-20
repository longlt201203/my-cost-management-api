import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class Auth2Service {
	constructor(private readonly authService: AuthService) {}

	async basicLogin(code: string) {
		const [email, password] = Buffer.from(code, "base64").toString().split(":");
		return await this.authService.basicLogin({
			email: email,
			password: password,
		});
	}
}
