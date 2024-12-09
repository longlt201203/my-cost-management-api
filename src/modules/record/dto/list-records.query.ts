import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";

export class ListRecordsQuery {
	@ApiProperty({ type: Date, required: false })
	@IsDate()
	@Type(() => Date)
	@IsOptional()
	date?: Date;
}
