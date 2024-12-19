import { CategoryEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { ClassTracing } from "magic-otel";
import { DataSource, Repository } from "typeorm";

@Injectable()
@ClassTracing()
export class CategoryRepository extends Repository<CategoryEntity> {
	constructor(datasource: DataSource) {
		super(CategoryEntity, datasource.createEntityManager());
	}
}
