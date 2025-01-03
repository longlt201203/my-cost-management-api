import { CategoryEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	color: string;

	@ApiProperty()
	accountId: number;

	static fromEntity(entity: CategoryEntity): CategoryResponse {
		return {
			id: entity.id,
			name: entity.name,
			color: entity.color,
			accountId: entity.accountId,
		};
	}

	static fromEntities(entities: CategoryEntity[]) {
		return entities.map(this.fromEntity);
	}
}
