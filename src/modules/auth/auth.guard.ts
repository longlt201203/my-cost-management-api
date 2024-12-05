import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { ClsService } from "nestjs-cls";
import { McmClsStore } from "@utils";
import { Tracing } from "magic-otel";
import { InvalidTokenError } from "./errors";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly cls: ClsService<McmClsStore>,
		private readonly authService: AuthService,
	) {}

	@Tracing()
	async canActivate(context: ExecutionContext) {
		const skipAuth =
			Reflect.getMetadata("skip-auth", context.getHandler()) ||
			Reflect.getMetadata("skip-auth", context.getClass());
		if (skipAuth) {
			return true;
		}
		const request = context.switchToHttp().getRequest<Request>();
		const token = this.getTokenFromHeader(request);
		if (!token) throw new InvalidTokenError();

		try {
			const account = await this.authService.verifyAccessToken(token);
			this.cls.set("account", account);

			return true;
		} catch (e) {
			throw new InvalidTokenError();
		}
	}

	getTokenFromHeader(request: Request) {
		const authorization = request.headers.authorization;
		if (!authorization || !authorization.startsWith("Bearer ")) {
			return null;
		}
		return authorization.split(" ")[1];
	}
}
