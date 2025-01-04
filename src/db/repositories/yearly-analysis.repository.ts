import { YearlyAnalysisEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class YearlyAnalysisRepository extends Repository<YearlyAnalysisEntity> {
	constructor(datasource: DataSource) {
		super(YearlyAnalysisEntity, datasource.createEntityManager());
	}
}
