import { BoardEntity } from "@db/entities";
import {
	BoardRepository,
	DailyAnalysisRepository,
	ExtractedRecordRepository,
	RecordRepository,
} from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { OpenAIService } from "@providers/openai";
import { ClassTracing } from "magic-otel";
import { Between } from "typeorm";
import { NoAnalysisFoundError, NoRecordFoundError } from "./errors";
import * as dayjs from "dayjs";
import { ManualAnalyzeBoardDailyRequest } from "./dto";
import { McmClsStore } from "@utils";
import { ClsService } from "nestjs-cls";
import { BoardNotFoundError } from "@modules/board/errors";

@Injectable()
@ClassTracing()
export class AnalysisService {
	constructor(
		private readonly openaiService: OpenAIService,
		private readonly recordRepository: RecordRepository,
		private readonly extractedRecordRepository: ExtractedRecordRepository,
		private readonly dailyAnalysisRepository: DailyAnalysisRepository,
		private readonly boardRepository: BoardRepository,
		private readonly cls: ClsService<McmClsStore>,
	) {}

	async getDailyAnalysis(
		boardId: number,
		date: dayjs.Dayjs,
		timezone?: string,
	) {
		const startDate = dayjs.tz(date.startOf("date"), timezone);
		const endDate = dayjs.tz(date.endOf("date"), timezone);
		const analysis = await this.dailyAnalysisRepository.findOne({
			where: {
				boardId: boardId,
				createdAt: Between(startDate.toDate(), endDate.toDate()),
			},
		});
		if (!analysis) throw new NoAnalysisFoundError();
		return analysis;
	}

	async getDailyExtractedRecord(
		boardId: number,
		date: dayjs.Dayjs,
		timezone?: string,
	) {
		const startDate = dayjs.tz(date.startOf("date"), timezone);
		const endDate = dayjs.tz(date.endOf("date"), timezone);
		return await this.extractedRecordRepository.find({
			where: {
				boardId: boardId,
				time: Between(startDate.toDate(), endDate.toDate()),
			},
		});
	}

	async manualAnalyzeBoardDaily(dto: ManualAnalyzeBoardDailyRequest) {
		const accountId = this.cls.get("account.id");
		const board = await this.boardRepository.findOne({
			where: {
				id: dto.boardId,
				accountId: accountId,
			},
		});
		if (!board) throw new BoardNotFoundError();
		await this.analyzeBoardDaily(board, dto.date, dto.timezone);
	}

	async analyzeBoardDaily(
		board: BoardEntity,
		date: dayjs.Dayjs,
		timezone?: string,
	) {
		const startDate = dayjs.tz(date.startOf("date"), timezone);
		const endDate = dayjs.tz(date.endOf("date"), timezone);

		const records = await this.recordRepository.find({
			where: {
				boardId: board.id,
				createdAt: Between(startDate.toDate(), endDate.toDate()),
			},
		});
		if (records.length === 0) throw new NoRecordFoundError();
		await Promise.all([
			this.extractedRecordRepository.delete({
				boardId: board.id,
				time: Between(startDate.toDate(), endDate.toDate()),
			}),
			this.dailyAnalysisRepository.delete({
				boardId: board.id,
				createdAt: Between(startDate.toDate(), endDate.toDate()),
			}),
		]);
		const content = records
			.map((record) => `Record ${record.id}: ${record.content}`)
			.join("\n");
		const extracted = await this.openaiService.analyzeDiary(
			content,
			board.currencyUnit,
		);
		const extractedRecords = await this.extractedRecordRepository.save(
			extracted.result.map((item) => ({
				boardId: board.id,
				time: item.recordTime || date.toDate(),
				recordId: item.recordId,
				description: item.description,
				amount: item.amount,
				paymentMethod: item.paymentMethod,
				location: item.location,
				notes: item.notes,
			})),
		);
		let total = 0;
		for (const record of extractedRecords) {
			total += record.amount;
		}
		await this.dailyAnalysisRepository.save({
			date: date.get("date"),
			month: date.get("month"),
			year: date.get("year"),
			boardId: board.id,
			total: total,
			createdAt: date.toDate(),
		});
		await this.boardRepository.update(
			{
				id: board.id,
			},
			{
				isAnalyzed: true,
			},
		);
	}
}
