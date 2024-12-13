import { BoardRepository, RecordRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import {
	CreateRecordRequest,
	ListRecordsQuery,
	UpdateRecordRequest,
} from "./dto";
import { ClassTracing } from "magic-otel";
import { McmClsStore } from "@utils";
import { ClsService } from "nestjs-cls";
import { RecordNotFoundError } from "./errors";
import { Between } from "typeorm";
import * as dayjs from "dayjs";

@Injectable()
@ClassTracing()
export class RecordService {
	constructor(
		private readonly recordRepository: RecordRepository,
		private readonly boardRepository: BoardRepository,
		private readonly cls: ClsService<McmClsStore>,
	) {}

	async create(dto: CreateRecordRequest) {
		const board = this.cls.get("board");
		const [result] = await Promise.all([
			this.recordRepository.save({
				content: dto.content,
				boardId: board.id,
				createdAt: new Date(),
			}),
			this.boardRepository.update(
				{
					id: board.id,
				},
				{
					isAnalyzed: false,
				},
			),
		]);
		return result;
	}

	async getAll(query: ListRecordsQuery) {
		const date = query.date || dayjs();
		const board = this.cls.get("board");
		return await this.recordRepository.find({
			where: {
				boardId: board.id,
				createdAt: Between(
					date.startOf("date").toDate(),
					date.endOf("date").toDate(),
				),
			},
		});
	}

	async delete(recordId: number) {
		const boardId = this.cls.get("board.id");
		await Promise.all([
			this.recordRepository.delete({
				id: recordId,
			}),
			this.boardRepository.update(
				{
					id: boardId,
				},
				{
					isAnalyzed: false,
				},
			),
		]);
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
		const boardId = this.cls.get("board.id");
		const record = await this.getOneOrFail(recordId);
		const [result] = await Promise.all([
			this.recordRepository.save({
				...record,
				content: dto.content,
			}),
			this.boardRepository.update(
				{
					id: boardId,
				},
				{
					isAnalyzed: false,
				},
			),
		]);
		return result;
	}
}
