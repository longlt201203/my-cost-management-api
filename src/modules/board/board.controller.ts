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
import { BoardService } from "./board.service";
import { BoardResponse, CreateBoardRequest, UpdateBoardRequest } from "./dto";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiResponseDto } from "@utils";
import { BoardGuard } from "./board.guard";

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
	async getDailyAnalysis() {
		const data = await this.boardService.getDailyAnalysis();
		return new ApiResponseDto(data, null, "Success!");
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