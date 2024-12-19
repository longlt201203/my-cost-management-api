import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateCategoryRequest {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	language: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	color?: string;
}
