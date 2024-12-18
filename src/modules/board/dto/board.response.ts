import { BoardEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";

export class BoardResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	title: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;

	@ApiProperty()
	currencyUnit: string;

	@ApiProperty()
	language: string;

	static fromEntity(entity: BoardEntity): BoardResponse {
		return {
			id: entity.id,
			title: entity.title,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
			currencyUnit: entity.currencyUnit,
			language: entity.language,
		};
	}

	static fromEntities(entities: BoardEntity[]): BoardResponse[] {
		return entities.map((entity) => BoardResponse.fromEntity(entity));
	}
}
