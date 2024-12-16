import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { CreateCategoryRequest, DeleteRequest } from "./dto";
import { SkipAuth } from "@modules/auth";

@Controller("category")
@ApiTags("category")
@SkipAuth()
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async findAll() {
		return await this.categoryService.findAll();
	}

	@Post("delete")
	async delete(@Body() dto: DeleteRequest) {
		return await this.categoryService.deleteByIds(dto);
	}

	@Post()
	async create(@Body() dto: CreateCategoryRequest) {
		return await this.categoryService.create(dto);
	}

	@Put(":id")
	async update(@Param("id") id: string, @Body() dto: CreateCategoryRequest) {
		return await this.categoryService.update(+id, dto);
	}
}
