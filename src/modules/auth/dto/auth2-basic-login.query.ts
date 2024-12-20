import { ApiProperty } from "@nestjs/swagger";

export class Auth2BasicLoginQuery {
	@ApiProperty()
	code: string;

	@ApiProperty()
	callback: string;
}
