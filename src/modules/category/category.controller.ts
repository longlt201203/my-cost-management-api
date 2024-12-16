import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { CategoryResponse, CreateCategoryRequest, DeleteRequest } from "./dto";
import { SkipAuth } from "@modules/auth";
import { ApiResponseDto } from "@utils";

@Controller("category")
@ApiTags("category")
@SkipAuth()
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async findAll() {
		const data = await this.categoryService.findAll();
		return new ApiResponseDto(
			CategoryResponse.fromEntities(data),
			null,
			"Success!",
		);
	}

	@Post("delete")
	async delete(@Body() dto: DeleteRequest) {
		await this.categoryService.deleteByIds(dto);
		return new ApiResponseDto(null, null, "Success!");
	}

	@Post()
	async create(@Body() dto: CreateCategoryRequest) {
		await this.categoryService.create(dto);
		return new ApiResponseDto(null, null, "Success!");
	}

	@Put(":id")
	async update(@Param("id") id: string, @Body() dto: CreateCategoryRequest) {
		await this.categoryService.update(+id, dto);
		return new ApiResponseDto(null, null, "Success!");
	}
}
