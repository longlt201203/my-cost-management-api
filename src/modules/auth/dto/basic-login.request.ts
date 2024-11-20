import { ApiProperty } from "@nestjs/swagger";

export class BasicLoginRequest {
	@ApiProperty({ example: "longlt201203@gmail.com" })
	email: string;

	@ApiProperty({ example: "Heheboi@123" })
	password: string;
}
