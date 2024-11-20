import { ExtractedRecordEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { ClassTracing } from "magic-otel";
import { DataSource, Repository } from "typeorm";

@Injectable()
@ClassTracing()
export class ExtractedRecordRepository extends Repository<ExtractedRecordEntity> {
	constructor(datasource: DataSource) {
		super(ExtractedRecordEntity, datasource.createEntityManager());
	}
}
