import { OmitType } from "@nestjs/swagger";
import { CreateCategoryRequest } from "./create-category.request";

export class UpdateCategoryRequest extends OmitType(CreateCategoryRequest, [
	"language",
]) {}
