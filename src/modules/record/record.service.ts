import { RecordRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { CreateRecordRequest } from "./dto";
import { BoardService } from "@modules/board";
import { ClassTracing } from "magic-otel";
import { McmClsStore } from "@utils";
import { ClsService } from "nestjs-cls";

@Injectable()
@ClassTracing()
export class RecordService {
	constructor(
		private readonly recordRepository: RecordRepository,
		private readonly boardService: BoardService,
		private readonly cls: ClsService<McmClsStore>,
	) {}

	async create(dto: CreateRecordRequest) {
		const boardId = this.cls.get("board.id");
		await this.boardService.getOneOrFail(boardId);
		return await this.recordRepository.save({
			content: dto.content,
			boardId: boardId,
		});
	}

	async getAll() {
		const boardId = this.cls.get("board.id");
		return await this.recordRepository.find({
			where: {
				boardId: boardId,
			},
		});
	}

	async delete(recordId: number) {
		const boardId = this.cls.get("board.id");
		await this.recordRepository.delete({
			id: recordId,
			boardId: boardId,
		});
	}
}
