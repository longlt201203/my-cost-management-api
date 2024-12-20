import { Controller, Get, Query, Req, Res } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { Auth2Service } from "../services";
import { Auth2BasicLoginQuery } from "../dto";
import { Request, Response } from "express";
import { Env } from "@utils";
import { InvalidCallbackUriError } from "../errors";
import { SkipAuth } from "../skip-auth.decorator";

@Controller("auth/2")
@ApiTags("auth")
@SkipAuth()
export class Auth2Controller {
	constructor(private readonly auth2Service: Auth2Service) {}

	@Get("basic")
	async basic(
		@Query() query: Auth2BasicLoginQuery,
		@Req() req: Request,
		@Res() res: Response,
	) {
		let uri: URL;
		try {
			uri = new URL(query.callback);
		} catch (error) {
			throw new InvalidCallbackUriError();
		}
		if (uri.hostname != Env.APP_DOMAIN) {
			throw new InvalidCallbackUriError();
		}
		const { accessToken, refreshToken } = await this.auth2Service.basicLogin(
			query.code,
		);
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: req.protocol === "https",
		});
		res.cookie("refreshToken", refreshToken, {
			path: "/api/auth/refresh-token",
			httpOnly: true,
			secure: req.protocol === "https",
		});
		res.redirect(query.callback);
	}

	@Get("logout")
	@ApiQuery({ name: "callback" })
	async logout(@Query("callback") callback: string, @Res() res: Response) {
		let uri: URL;
		try {
			uri = new URL(callback);
		} catch (error) {
			throw new InvalidCallbackUriError();
		}
		if (uri.hostname != Env.APP_DOMAIN) {
			throw new InvalidCallbackUriError();
		}
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.redirect(callback);
	}
}
