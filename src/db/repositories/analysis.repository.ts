import { Injectable } from "@nestjs/common";
import { DailyAnalysisRepository } from "./daily-analysis.repository";
import { ExtractedRecordRepository } from "./extracted-record.repository";
import { ExtractedRecordCategoryRepository } from "./extracted-record-category.repository";
import * as dayjs from "dayjs";
import { Between } from "typeorm";
import { PromiseAllHandler } from "@utils";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class AnalysisRepository {
	constructor(
		private readonly dailyAnalysisRepository: DailyAnalysisRepository,
		private readonly extractedRecordRepository: ExtractedRecordRepository,
		private readonly extractedRecordCategoryRepository: ExtractedRecordCategoryRepository,
	) {}

	@Transactional()
	async cleanUpDailyAnalysis(
		boardId: number,
		date: dayjs.Dayjs,
		timezone?: string,
	) {
		const startDate = dayjs.tz(date.startOf("date"), timezone);
		const endDate = dayjs.tz(date.endOf("date"), timezone);

		const [_, ids] = await Promise.all([
			this.dailyAnalysisRepository.delete({
				boardId: boardId,
				createdAt: Between(startDate.toDate(), endDate.toDate()),
			}),
			this.extractedRecordRepository.findIdsAndDelete({
				boardId: boardId,
				time: Between(startDate.toDate(), endDate.toDate()),
			}),
		]);

		const handler = new PromiseAllHandler(10, 50);
		for (const id of ids) {
			handler.push(
				this.extractedRecordCategoryRepository.delete({
					extractedRecordId: id,
				}),
			);
		}
		await handler.execute();
	}
}
