import { CategoryEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	static fromEntity(entity: CategoryEntity): CategoryResponse {
		return {
			id: entity.id,
			name: entity.name,
		};
	}

	static fromEntities(entities: CategoryEntity[]) {
		return entities.map(this.fromEntity);
	}
}
