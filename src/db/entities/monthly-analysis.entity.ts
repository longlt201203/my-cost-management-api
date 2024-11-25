import { DbConstants } from "@db/db.constants";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BoardEntity } from "./board.entity";

const { ColumnName, TableName } = DbConstants;

@Entity(TableName.MonthlyAnalysis)
export class MonthlyAnalysisEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnName.MonthlyAnalysis.id })
	id: number;

	@Column({ name: ColumnName.MonthlyAnalysis.dailyAvg })
	dailyAvg: number;

	@Column({ name: ColumnName.MonthlyAnalysis.month })
	month: number;

	@Column({ name: ColumnName.MonthlyAnalysis.year })
	year: number;

	@Column({ name: ColumnName.MonthlyAnalysis.total })
	total: number;

	@Column({ name: ColumnName.MonthlyAnalysis.mean })
	mean: number;

	@Column({ name: ColumnName.MonthlyAnalysis.variant })
	variant: number;

	@Column({ name: ColumnName.Board.id })
	boardId: number;

	@ManyToOne(() => BoardEntity)
	board: BoardEntity;
}
