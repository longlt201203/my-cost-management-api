import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCategoryRequest {
	@ApiProperty()
	@IsString()
	name: string;
}
