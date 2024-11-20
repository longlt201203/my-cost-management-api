import { RecordEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { ClassTracing } from "magic-otel";
import { DataSource, Repository } from "typeorm";

@Injectable()
@ClassTracing()
export class RecordRepository extends Repository<RecordEntity> {
	constructor(datasource: DataSource) {
		super(RecordEntity, datasource.createEntityManager());
	}
}
