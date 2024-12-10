import { ApiProperty } from "@nestjs/swagger";
import { IsDateInRange } from "@utils";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class ManualAnalyzeBoardDailyRequest {
	@ApiProperty()
	@IsNumber()
	boardId: number;

	@ApiProperty({ type: Date })
	@IsDateInRange({ maxDate: () => new Date() })
	@Type(() => Date)
	date: Date;
}
