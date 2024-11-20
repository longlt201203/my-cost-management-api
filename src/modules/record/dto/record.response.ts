import { RecordEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";

export class RecordResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	content: string;

	@ApiProperty()
	createdAt: Date;

	static fromEntity(entity: RecordEntity): RecordResponse {
		return {
			id: entity.id,
			content: entity.content,
			createdAt: entity.createdAt,
		};
	}

	static fromEntities(entities: RecordEntity[]): RecordResponse[] {
		return entities.map((entity) => RecordResponse.fromEntity(entity));
	}
}
