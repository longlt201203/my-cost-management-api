import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetCategoriesQuery {
	@ApiProperty()
	@IsString()
	language: string;
}
