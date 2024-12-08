import { DbConstants } from "@db/db.constants";
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { BoardEntity } from "./board.entity";

const { ColumnName, TableName } = DbConstants;

@Entity(TableName.Record)
export class RecordEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnName.Record.id })
	id: number;

	@Column({ name: ColumnName.Record.content })
	content: string;

	@Column({ name: ColumnName.Global.createdAt })
	createdAt: Date;

	@Column({ name: ColumnName.Board.id })
	boardId: number;

	@ManyToOne(() => BoardEntity)
	@JoinColumn({ name: ColumnName.Board.id })
	board: BoardEntity;
}
