import { DbConstants } from "@db/db.constants";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BoardEntity } from "./board.entity";

const { ColumnName, TableName } = DbConstants;

@Entity(TableName.YearlyAnalysis)
export class YearlyAnalysisEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnName.YearlyAnalysis.id })
	id: number;

	@Column({ name: ColumnName.YearlyAnalysis.year })
	year: number;

	@Column({ name: ColumnName.YearlyAnalysis.monthAvg })
	monthAvg: number;

	@Column({ name: ColumnName.YearlyAnalysis.total })
	total: number;

	@Column({ name: ColumnName.YearlyAnalysis.median })
	median: number;

	@Column({ name: ColumnName.YearlyAnalysis.variant })
	variant: number;

	@ManyToOne(() => BoardEntity, (board) => board.id)
	board: number;
}
