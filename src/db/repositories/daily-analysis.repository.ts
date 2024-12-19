import { DailyAnalysisEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { ClassTracing } from "magic-otel";
import { DataSource, Repository } from "typeorm";

@Injectable()
@ClassTracing()
export class DailyAnalysisRepository extends Repository<DailyAnalysisEntity> {
	constructor(datasource: DataSource) {
		super(DailyAnalysisEntity, datasource.createEntityManager());
	}
}
