import { BoardRepository, RecordRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import {
	CreateRecordRequest,
	ListRecordsQuery,
	UpdateRecordRequest,
} from "./dto";
import { ClassTracing } from "magic-otel";
import { McmClsStore, redisClient } from "@utils";
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

	async scheduleAnalyze(boardId: number, createdAt: Date) {
		const key = `analyze:${boardId}:${dayjs(createdAt).format("YYYY-MM-DD")}`;
		await redisClient.set(key, 1, {
			EX: 10 * 60,
		});
	}

	async create(dto: CreateRecordRequest) {
		const board = this.cls.get("board");
		const createdAt = dto.createdAt || new Date();
		const [result] = await Promise.all([
			this.recordRepository.save({
				content: dto.content,
				boardId: board.id,
				createdAt: createdAt,
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
		this.scheduleAnalyze(board.id, createdAt);
		return result;
	}

	async getAll(query: ListRecordsQuery) {
		let date = query.date || dayjs();
		const startDate = dayjs.tz(date.startOf("date"), query.timezone);
		const endDate = dayjs.tz(date.endOf("date"), query.timezone);
		const board = this.cls.get("board");
		return await this.recordRepository.find({
			where: {
				boardId: board.id,
				createdAt: Between(startDate.toDate(), endDate.toDate()),
			},
		});
	}

	async delete(recordId: number) {
		const boardId = this.cls.get("board.id");
		const record = await this.getOneOrFail(recordId);
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
		this.scheduleAnalyze(boardId, record.createdAt);
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
		const oldCreatedAt = record.createdAt;
		const createdAt = dto.createdAt || record.createdAt;
		const [result] = await Promise.all([
			this.recordRepository.save({
				...record,
				content: dto.content,
				createdAt: dto.createdAt || record.createdAt,
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
		this.scheduleAnalyze(boardId, oldCreatedAt);
		this.scheduleAnalyze(boardId, createdAt);
		return result;
	}
}
