import { CategoryEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class CategoryRepository extends Repository<CategoryEntity> {
	constructor(datasource: DataSource) {
		super(CategoryEntity, datasource.createEntityManager());
	}
}
