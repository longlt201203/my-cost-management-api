import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsPhoneNumber, IsStrongPassword } from "class-validator";

export class CreateAccountRequest {
	@ApiProperty({ example: "longlt201203@gmail.com" })
	@IsEmail()
	email: string;

	@ApiProperty({ example: "0334449999" })
	@IsPhoneNumber("VN")
	phone: string;

	@ApiProperty({ example: "Heheboi@123" })
	@IsStrongPassword({
		minLength: 6,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 0,
	})
	password: string;
}
