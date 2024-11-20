import { AccountEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";

export class ProfileResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	email: string;

	@ApiProperty()
	phone: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;

	static fromEntity(entity: AccountEntity): ProfileResponse {
		return {
			id: entity.id,
			email: entity.email,
			phone: entity.phone,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}
