import { DailyAnalysisEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class DailyAnalysisRepository extends Repository<DailyAnalysisEntity> {
	constructor(datasource: DataSource) {
		super(DailyAnalysisEntity, datasource.createEntityManager());
	}
}
