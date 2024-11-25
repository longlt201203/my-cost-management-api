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

@Entity(TableName.DailyAnalysis)
export class DailyAnalysisEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnName.DailyAnalysis.id })
	id: number;

	@Column({ name: ColumnName.DailyAnalysis.date })
	date: number;

	@Column({ name: ColumnName.DailyAnalysis.month })
	month: number;

	@Column({ name: ColumnName.DailyAnalysis.year })
	year: number;

	@Column({ name: ColumnName.DailyAnalysis.total })
	total: number;

	@Column({ name: ColumnName.Board.id })
	boardId: number;

	@ManyToOne(() => BoardEntity)
	@JoinColumn({ name: ColumnName.Board.id })
	board: BoardEntity;
}
