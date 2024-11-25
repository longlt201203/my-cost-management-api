import { RecordRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { CreateRecordRequest, UpdateRecordRequest } from "./dto";
import { BoardService } from "@modules/board";
import { ClassTracing } from "magic-otel";
import { McmClsStore } from "@utils";
import { ClsService } from "nestjs-cls";
import { RecordNotFoundError } from "./errors";

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

	async getOneOrFail(recordId: number) {
		const boardId = this.cls.get("board.id");
		const record = await this.recordRepository.findOne({
			where: {
				id: recordId,
				boardId: boardId,
			},
		});
		if (!record) throw new RecordNotFoundError();
		return record;
	}

	async update(recordId: number, dto: UpdateRecordRequest) {
		const record = await this.getOneOrFail(recordId);
		return await this.recordRepository.save({
			...record,
			content: dto.content,
		});
	}
}
