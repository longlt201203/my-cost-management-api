import { CategoryRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import {
	CreateCategoryRequest,
	DeleteRequest,
	GetCategoriesQuery,
	UpdateCategoryRequest,
} from "./dto";
import { In } from "typeorm";

@Injectable()
export class CategoryService {
	constructor(private readonly categoryRepo: CategoryRepository) {}

	async create(dto: CreateCategoryRequest) {
		return await this.categoryRepo.save({
			name: dto.name,
			language: dto.language,
			color: dto.color,
		});
	}

	async update(id: number, dto: UpdateCategoryRequest) {
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
		return await this.categoryRepo.delete({
			id: In(dto.ids),
		});
	}

	async findAll(query: GetCategoriesQuery) {
		return await this.categoryRepo.find({
			where: {
				language: query.language,
			},
		});
	}
}
