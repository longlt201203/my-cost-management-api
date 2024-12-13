import { ApiProperty } from "@nestjs/swagger";
import { IsDayjs, IsDayjsInRange, transformToDayjs } from "@utils";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";
import * as dayjs from "dayjs";

export class ManualAnalyzeBoardDailyRequest {
	@ApiProperty()
	@IsNumber()
	boardId: number;

	@ApiProperty({ type: Date })
	@Transform(transformToDayjs)
	@IsDayjs()
	@IsDayjsInRange({ maxDate: () => dayjs() })
	date: dayjs.Dayjs;
}
