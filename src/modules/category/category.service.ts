import { CategoryRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import {
	CreateCategoryRequest,
	DeleteRequest,
	GetCategoriesQuery,
	UpdateCategoryRequest,
} from "./dto";
import { Equal, In, IsNull, Or } from "typeorm";
import { ClsService } from "nestjs-cls";
import { McmClsStore } from "@utils";
import { CategoryNotOwnedError } from "./errors";

@Injectable()
export class CategoryService {
	constructor(
		private readonly categoryRepo: CategoryRepository,
		private readonly cls: ClsService<McmClsStore>,
	) {}

	async create(dto: CreateCategoryRequest) {
		const accountId = this.cls.get("account.id");
		return await this.categoryRepo.save({
			name: dto.name,
			language: dto.language,
			color: dto.color,
			accountId: accountId,
		});
	}

	async getOwnedCategoryById(id: number, throwOnFail?: boolean) {
		const accountId = this.cls.get("account.id");
		const category = await this.categoryRepo.findOne({
			where: {
				id: id,
				accountId: accountId,
			},
		});
		if (!category && throwOnFail) {
			throw new CategoryNotOwnedError();
		}
		return category;
	}

	async update(id: number, dto: UpdateCategoryRequest) {
		await this.getOwnedCategoryById(id, true);
		return await this.categoryRepo.update(
			{
				id: id,
			},
			{
				name: dto.name,
				color: dto.color,
			},
		);
	}

	async deleteByIds(dto: DeleteRequest) {
		await this.getOwnedCategoryById(id, true);
		return await this.categoryRepo.delete({
			id: In(dto.ids),
		});
	}

	async findAll(query: GetCategoriesQuery) {
		const accountId = this.cls.get("account.id");
		return await this.categoryRepo.find({
			where: {
				accountId: Or(IsNull(), Equal(accountId)),
				language: query.language,
			},
		});
	}
}
