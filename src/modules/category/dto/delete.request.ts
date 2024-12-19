import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class DeleteRequest {
	@ApiProperty({ type: Number, isArray: true })
	@IsNumber({}, { each: true })
	ids: string[];
}
