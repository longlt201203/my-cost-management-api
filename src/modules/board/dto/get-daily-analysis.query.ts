import { ApiProperty } from "@nestjs/swagger";
import { IsDateInRange } from "@utils";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class GetDailyAnalysisQuery {
	@ApiProperty({ type: Date, required: false })
	@IsDateInRange({ maxDate: () => new Date() })
	@Type(() => Date)
	@IsOptional()
	date?: Date;
}
