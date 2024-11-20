import { AccountRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { ClassTracing } from "magic-otel";
import { BasicLoginRequest } from "./dto";
import { InvalidTokenError, WrongUsernameOrPasswordError } from "./errors";
import * as jwt from "jsonwebtoken";
import { Env, McmClsStore } from "@utils";
import * as bcrypt from "bcrypt";
import { ClsService } from "nestjs-cls";

@Injectable()
@ClassTracing()
export class AuthService {
	constructor(
		private readonly accountRepository: AccountRepository,
		private readonly cls: ClsService<McmClsStore>,
	) {}

	async issueTokenPair(accountId: number) {
		const accessToken = jwt.sign({}, Env.JWT_AT_SECRET, {
			subject: accountId.toString(),
			expiresIn: Env.JWT_AT_EXPIRES_IN,
		});
		const refreshToken = jwt.sign({}, Env.JWT_RT_SECRET, {
			subject: accountId.toString(),
			expiresIn: Env.JWT_RT_EXPIRES_IN,
		});
		return {
			accessToken,
			refreshToken,
		};
	}

	async basicLogin(dto: BasicLoginRequest) {
		const account = await this.accountRepository.findOne({
			where: {
				email: dto.email,
			},
		});
		if (!account) {
			throw new WrongUsernameOrPasswordError();
		}
		const compare = await bcrypt.compare(dto.password, account.password);
		if (!compare) {
			throw new WrongUsernameOrPasswordError();
		}
		return this.issueTokenPair(account.id);
	}

	async refreshToken(refreshToken: string) {
		const decoded = jwt.verify(refreshToken, Env.JWT_RT_SECRET);
		if (typeof decoded !== "object" || !decoded.sub) {
			throw new InvalidTokenError();
		}
		return this.issueTokenPair(parseInt(decoded.sub));
	}

	async verifyAccessToken(accessToken: string) {
		const decoded = jwt.verify(accessToken, Env.JWT_AT_SECRET);
		if (typeof decoded !== "object" || !decoded.sub) {
			throw new InvalidTokenError();
		}
		const accountId = parseInt(decoded.sub);
		const account = await this.accountRepository.findOne({
			where: { id: accountId },
		});

		if (!account) {
			throw new InvalidTokenError();
		}

		return account;
	}

	getCurrentAccount() {
		const account = this.cls.get("account");
		return account;
	}
}
