import { ExtractedRecordEntity } from "@db/entities";

export class ExtractedRecordResponse {
	id: number;
	time: Date;
	description: string;
	amount: number;
	paymentMethod: string;
	location: string;
	notes: string;
	categories: string[];

	static fromEntity(entity: ExtractedRecordEntity): ExtractedRecordResponse {
		return {
			id: entity.id,
			time: entity.time,
			amount: entity.amount,
			description: entity.description,
			location: entity.location,
			notes: entity.notes,
			paymentMethod: entity.paymentMethod,
			categories: entity.extractedRecordCategories.map(
				(item) => item.category.name,
			),
		};
	}

	static fromEntities(entities: ExtractedRecordEntity[]) {
		return entities.map(this.fromEntity);
	}
}
