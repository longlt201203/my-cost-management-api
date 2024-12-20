import { ApiProperty } from "@nestjs/swagger";

export enum CheckExistsAccountField {
	EMAIL = "email",
	PHONE = "phone",
}

export class CheckExistsAccountRequest {
	@ApiProperty({ enum: CheckExistsAccountField })
	field: string;

	@ApiProperty()
	value: string;
}
