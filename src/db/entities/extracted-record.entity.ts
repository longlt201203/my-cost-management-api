import { DbConstants } from "@db/db.constants";
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { RecordEntity } from "./record.entity";
import { BoardEntity } from "./board.entity";
import { ExtractedRecordCategoryEntity } from "./extracted-record-category.entity";

const { ColumnName, TableName } = DbConstants;

@Entity(TableName.ExtractedRecord)
export class ExtractedRecordEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnName.ExtractedRecord.id })
	id: number;

	@Column({ name: ColumnName.ExtractedRecord.time })
	time: Date;

	@Column({ name: ColumnName.ExtractedRecord.description })
	description: string;

	@Column({ name: ColumnName.ExtractedRecord.amount })
	amount: number;

	@Column({ name: ColumnName.ExtractedRecord.paymentMethod, nullable: true })
	paymentMethod: string;

	@Column({ name: ColumnName.ExtractedRecord.location, nullable: true })
	location: string;

	@Column({ name: ColumnName.ExtractedRecord.notes, nullable: true })
	notes: string;

	@Column({ name: ColumnName.Record.id })
	recordId: number;

	@ManyToOne(() => RecordEntity)
	@JoinColumn({ name: ColumnName.Record.id })
	record: RecordEntity;

	@Column({ name: ColumnName.Board.id })
	boardId: number;

	@ManyToOne(() => BoardEntity)
	@JoinColumn({ name: ColumnName.Board.id })
	board: BoardEntity;

	@OneToMany(
		() => ExtractedRecordCategoryEntity,
		(extractedRecordCategory) => extractedRecordCategory.extractedRecord,
	)
	extractedRecordCategories: ExtractedRecordCategoryEntity[];
}
