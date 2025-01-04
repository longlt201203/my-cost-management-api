import { ApiProperty } from "@nestjs/swagger";
import { IsDayjs, IsDayjsInRange, transformToDayjs } from "@utils";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import * as dayjs from "dayjs";

export class ManualAnalyzeBoardYearlyRequest {
	@ApiProperty()
	@IsNumber()
	boardId: number;

	@ApiProperty({ type: Date })
	@Transform(transformToDayjs)
	@IsDayjs()
	@IsDayjsInRange({ maxDate: () => dayjs() })
	date: dayjs.Dayjs;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	timezone?: string;
}
