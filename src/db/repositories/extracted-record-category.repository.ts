import { ExtractedRecordCategoryEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { ClassTracing } from "magic-otel";
import { DataSource, Repository } from "typeorm";

@Injectable()
@ClassTracing()
export class ExtractedRecordCategoryRepository extends Repository<ExtractedRecordCategoryEntity> {
	constructor(datasource: DataSource) {
		super(ExtractedRecordCategoryEntity, datasource.createEntityManager());
	}
}
