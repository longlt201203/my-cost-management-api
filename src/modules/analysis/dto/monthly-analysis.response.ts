import { MonthlyAnalysisEntity } from "@db/entities";

export class MonthlyAnalysisResponse {
	id: number;
	month: number;
	year: number;
	dailyAvg: number;
	total: number;

	static fromEntity(entity: MonthlyAnalysisEntity): MonthlyAnalysisResponse {
		return {
			id: entity.id,
			month: entity.month,
			year: entity.year,
			dailyAvg: entity.dailyAvg,
			total: entity.total,
		};
	}
}
