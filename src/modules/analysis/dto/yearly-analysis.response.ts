import { YearlyAnalysisEntity } from "@db/entities";

export class YearlyAnalysisResponse {
	id: number;
	year: number;
	monthAvg: number;
	total: number;

	static fromEntity(entity: YearlyAnalysisEntity): YearlyAnalysisResponse {
		return {
			id: entity.id,
			year: entity.year,
			monthAvg: entity.monthAvg,
			total: entity.total,
		};
	}
}
