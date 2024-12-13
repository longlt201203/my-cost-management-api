import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRecordRequest {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	content: string;

	@ApiProperty({ type: Date, required: false })
	@IsOptional()
	@IsDate()
	@Type(() => Date)
	createdAt?: Date;
}
