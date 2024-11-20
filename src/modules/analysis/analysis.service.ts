import { BoardEntity, RecordEntity } from "@db/entities";
import { ExtractedRecordRepository, RecordRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { OpenAIService } from "@providers/openai";
import { ClassTracing } from "magic-otel";
import { Between, In } from "typeorm";
import { NoRecordFoundError } from "./errors";

@Injectable()
@ClassTracing()
export class AnalysisService {
	constructor(
		private readonly openaiService: OpenAIService,
		private readonly recordRepository: RecordRepository,
		private readonly extractedRecordRepository: ExtractedRecordRepository,
	) {}

	async analyzeBoardInRange(board: BoardEntity, start: Date, end: Date) {
		const records = await this.recordRepository.find({
			where: {
				boardId: board.id,
				createdAt: Between(start, end),
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
		return extractedRecords;
	}
}
