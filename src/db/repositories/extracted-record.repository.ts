import { ExtractedRecordEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { ClassTracing } from "magic-otel";
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { ExtractedRecordCategoryRepository } from "./extracted-record-category.repository";

@Injectable()
@ClassTracing()
export class ExtractedRecordRepository extends Repository<ExtractedRecordEntity> {
	constructor(
		datasource: DataSource,
		private readonly extractedRecordCategoryRepository: ExtractedRecordCategoryRepository,
	) {
		super(ExtractedRecordEntity, datasource.createEntityManager());
	}

	@Transactional()
	async createWithCategories(
		entity: DeepPartial<ExtractedRecordEntity>,
		categories: number[],
	) {
		const record = await this.save(entity);

		const recordCategories = await this.extractedRecordCategoryRepository.save(
			categories.map((item) => ({
				categoryId: item,
				extractedRecordId: record.id,
			})),
		);

		record.extractedRecordCategories = recordCategories;

		return record;
	}

	async findIdsAndDelete(criteria: FindOptionsWhere<ExtractedRecordEntity>) {
		const records = await this.find({ where: criteria });
		const ids = records.map((item) => item.id);
		await this.delete(ids);
		return ids;
	}
}
