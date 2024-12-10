import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
} from "@nestjs/common";
import { BoardService } from "./board.service";
import {
	BoardResponse,
	CreateBoardRequest,
	GetDailyAnalysisQuery,
	UpdateBoardRequest,
} from "./dto";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiResponseDto } from "@utils";
import { BoardGuard } from "./board.guard";
import { DailyAnalysisResponse } from "@modules/analysis/dto";

@Controller("board")
@ApiTags("board")
@ApiBearerAuth()
export class BoardController {
	constructor(private readonly boardService: BoardService) {}

	@Post()
	async create(@Body() dto: CreateBoardRequest) {
		const data = await this.boardService.create(dto);
		return new ApiResponseDto(BoardResponse.fromEntity(data), null, "Success!");
	}

	@Get(":boardId/analysis/daily")
	@ApiParam({ name: "boardId", type: "number" })
	@UseGuards(BoardGuard)
	async getDailyAnalysis(@Query() query: GetDailyAnalysisQuery) {
		const { analysis, extractedRecords } =
			await this.boardService.getDailyAnalysis(query);
		return new ApiResponseDto(
			DailyAnalysisResponse.fromEntity(analysis, extractedRecords),
			null,
			"Success!",
		);
	}

	@Get(":boardId")
	@ApiParam({ name: "boardId", type: "number" })
	@UseGuards(BoardGuard)
	async getOne() {
		const data = this.boardService.getClsBoard();
		return new ApiResponseDto(BoardResponse.fromEntity(data), null, "Success!");
	}

	@Get()
	async getAll() {
		const data = await this.boardService.getAll();
		return new ApiResponseDto(
			BoardResponse.fromEntities(data),
			null,
			"Success!",
		);
	}

	@Put(":boardId")
	@ApiParam({ name: "boardId", type: "number" })
	@UseGuards(BoardGuard)
	async update(@Body() dto: UpdateBoardRequest) {
		const data = await this.boardService.update(dto);
		return new ApiResponseDto(BoardResponse.fromEntity(data), null, "Success!");
	}

	@Delete(":boardId")
	@ApiParam({ name: "boardId", type: "number" })
	@UseGuards(BoardGuard)
	async delete() {
		await this.boardService.delete();
		return new ApiResponseDto(null, null, "Success!");
	}
}
