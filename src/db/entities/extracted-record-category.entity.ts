import { DbConstants } from "@db/db.constants";
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { ExtractedRecordEntity } from "./extracted-record.entity";
import { CategoryEntity } from "./category.entity";

const { ColumnName, TableName } = DbConstants;

@Entity(TableName.ExtractedRecordCategory)
export class ExtractedRecordCategoryEntity {
	@PrimaryGeneratedColumn("increment", {
		name: ColumnName.ExtractedRecordCategory.id,
	})
	id: number;

	@Column({ name: ColumnName.ExtractedRecord.id })
	extractedRecordId: number;

	@Column({ name: ColumnName.Category.id })
	categoryId: number;

	@ManyToOne(() => ExtractedRecordEntity)
	@JoinColumn({ name: ColumnName.ExtractedRecord.id })
	extractedRecord: ExtractedRecordEntity;

	@ManyToOne(() => CategoryEntity)
	@JoinColumn({ name: ColumnName.Category.id })
	category: CategoryEntity;
}
