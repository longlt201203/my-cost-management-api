import { DbConstants } from "@db/db.constants";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

const { ColumnName, TableName } = DbConstants;

@Entity(TableName.Category)
export class CategoryEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnName.Category.id })
	id: number;

	@Column({ name: ColumnName.Category.name })
	name: string;

	@Column({ name: ColumnName.Category.language, default: "en" })
	language: string;

	@Column({ name: ColumnName.Category.color, nullable: true })
	color: string;
}
