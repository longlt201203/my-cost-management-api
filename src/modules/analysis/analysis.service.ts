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
import { Between, In } from "typeorm";
import { NoRecordFoundError } from "./errors";
import * as dayjs from "dayjs";

@Injectable()
@ClassTracing()
export class AnalysisService {
	constructor(
		private readonly openaiService: OpenAIService,
		private readonly recordRepository: RecordRepository,
		private readonly extractedRecordRepository: ExtractedRecordRepository,
		private readonly dailyAnalysisRepository: DailyAnalysisRepository,
		private readonly boardRepository: BoardRepository,
	) {}

	async getDailyAnalysis(boardId: number) {
		const now = dayjs();
		return await this.dailyAnalysisRepository.findOne({
			where: {
				boardId: boardId,
				createdAt: Between(
					now.startOf("date").toDate(),
					now.endOf("date").toDate(),
				),
			},
		});
	}

	async getDailyExtractedRecord(boardId: number) {
		const now = dayjs();
		return await this.extractedRecordRepository.find({
			where: {
				boardId: boardId,
				time: Between(now.startOf("date").toDate(), now.endOf("date").toDate()),
			},
		});
	}

	async analyzeBoardDaily(board: BoardEntity) {
		const now = dayjs();

		const records = await this.recordRepository.find({
			where: {
				boardId: board.id,
				createdAt: Between(
					now.startOf("date").toDate(),
					now.endOf("date").toDate(),
				),
			},
		});
		if (records.length === 0) throw new NoRecordFoundError();
		const recordIds = records.map((record) => record.id);
		await Promise.all([
			this.extractedRecordRepository.delete({ recordId: In(recordIds) }),
			this.dailyAnalysisRepository.delete({
				boardId: board.id,
				createdAt: Between(
					now.startOf("date").toDate(),
					now.endOf("date").toDate(),
				),
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
				time: item.recordTime || new Date(),
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
			date: now.get("date"),
			month: now.get("month"),
			year: now.get("year"),
			boardId: board.id,
			total: total,
			createdAt: now.toDate(),
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
