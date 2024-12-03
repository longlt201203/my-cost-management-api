import {
	BoardEntity,
	DailyAnalysisEntity,
	ExtractedRecordEntity,
	RecordEntity,
} from "@db/entities";
import {
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
import { Transactional } from "typeorm-transactional";

@Injectable()
@ClassTracing()
export class AnalysisService {
	constructor(
		private readonly openaiService: OpenAIService,
		private readonly recordRepository: RecordRepository,
		private readonly extractedRecordRepository: ExtractedRecordRepository,
		private readonly dailyAnalysisRepository: DailyAnalysisRepository,
	) {}

	@Transactional()
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
		await this.extractedRecordRepository.delete({ recordId: In(recordIds) });
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
		const analysis = await this.dailyAnalysisRepository.save({
			date: now.get("date"),
			month: now.get("month"),
			year: now.get("year"),
			boardId: board.id,
			total: total,
		});
		return { extractedRecords, analysis };
	}
}
