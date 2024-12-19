import { ExtractedRecordEntity } from "@db/entities";
import { CategoryResponse } from "@modules/category/dto";

export class ExtractedRecordResponse {
	id: number;
	time: Date;
	description: string;
	amount: number;
	paymentMethod: string;
	location: string;
	notes: string;
	categories: CategoryResponse[];

	static fromEntity(entity: ExtractedRecordEntity): ExtractedRecordResponse {
		return {
			id: entity.id,
			time: entity.time,
			amount: entity.amount,
			description: entity.description,
			location: entity.location,
			notes: entity.notes,
			paymentMethod: entity.paymentMethod,
			categories: entity.extractedRecordCategories.map((item) =>
				CategoryResponse.fromEntity(item.category),
			),
		};
	}

	static fromEntities(entities: ExtractedRecordEntity[]) {
		return entities.map(this.fromEntity);
	}
}
