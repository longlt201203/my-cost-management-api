import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { RecordService } from "./record.service";
import { ApiResponseDto } from "@utils";
import {
	CreateRecordRequest,
	RecordResponse,
	UpdateRecordRequest,
} from "./dto";
import { BoardGuard } from "@modules/board";

@Controller("board/:boardId/record")
@ApiTags("record")
@ApiBearerAuth()
@ApiParam({ name: "boardId", type: Number })
@UseGuards(BoardGuard)
export class RecordController {
	constructor(private readonly recordService: RecordService) {}

	@Get()
	async getAll() {
		const data = await this.recordService.getAll();
		return new ApiResponseDto(
			RecordResponse.fromEntities(data),
			null,
			"Success!",
		);
	}

	@Post()
	async create(@Body() dto: CreateRecordRequest) {
		const data = await this.recordService.create(dto);
		return new ApiResponseDto(
			RecordResponse.fromEntity(data),
			null,
			"Success!",
		);
	}

	@Delete(":recordId")
	async delete(@Param("recordId") recordId: string) {
		await this.recordService.delete(+recordId);
		return new ApiResponseDto(null, null, "Success!");
	}

	@Put(":recordId")
	async update(
		@Param("recordId") recordId: string,
		@Body() dto: UpdateRecordRequest,
	) {
		const data = await this.recordService.update(+recordId, dto);
		return new ApiResponseDto(
			RecordResponse.fromEntity(data),
			null,
			"Success!",
		);
	}
}
