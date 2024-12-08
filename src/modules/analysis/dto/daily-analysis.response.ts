import { DailyAnalysisEntity, ExtractedRecordEntity } from "@db/entities";
import { ExtractedRecordResponse } from "./extracted-record.response";

export class DailyAnalysisResponse {
	id: number;
	date: number;
	month: number;
	year: number;
	total: number;
	createdAt: Date;
	extractedRecords: ExtractedRecordResponse[];

	static fromEntity(
		entity: DailyAnalysisEntity,
		extractedRecordEntities: ExtractedRecordEntity[],
	): DailyAnalysisResponse {
		return {
			id: entity.id,
			date: entity.date,
			month: entity.month,
			year: entity.year,
			total: entity.total,
			createdAt: entity.createdAt,
			extractedRecords: ExtractedRecordResponse.fromEntities(
				extractedRecordEntities,
			),
		};
	}
}
