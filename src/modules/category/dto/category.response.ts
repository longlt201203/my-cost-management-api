import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;
}
