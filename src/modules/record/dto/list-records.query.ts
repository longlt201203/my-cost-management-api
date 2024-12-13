import { ApiProperty } from "@nestjs/swagger";
import { IsDayjs, IsDayjsInRange, transformToDayjs } from "@utils";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import * as dayjs from "dayjs";

export class ListRecordsQuery {
	@ApiProperty({ type: Date, required: false })
	@IsOptional()
	@Transform(transformToDayjs)
	@IsDayjs()
	@IsDayjsInRange({ maxDate: () => dayjs() })
	date?: dayjs.Dayjs;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	timezone?: string;
}
