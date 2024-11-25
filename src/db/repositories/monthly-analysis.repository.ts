import { MonthlyAnalysisEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class MonthlyAnalysisRepository extends Repository<MonthlyAnalysisEntity> {
	constructor(datasource: DataSource) {
		super(MonthlyAnalysisEntity, datasource.createEntityManager());
	}
}
