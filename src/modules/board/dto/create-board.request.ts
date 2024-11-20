import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBoardRequest {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({ example: "kVND" })
	@IsString()
	@IsNotEmpty()
	currencyUnit: string;
}
