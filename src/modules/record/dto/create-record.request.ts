import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRecordRequest {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	content: string;
}
