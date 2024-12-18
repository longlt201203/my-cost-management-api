import { DbConstants } from "@db/db.constants";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { AccountEntity } from "./account.entity";

const { ColumnName, TableName } = DbConstants;

@Entity(TableName.Board)
export class BoardEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnName.Board.id })
	id: number;

	@Column({ name: ColumnName.Board.title })
	title: string;

	@Column({ name: ColumnName.Board.currencyUnit })
	currencyUnit: string;

	@Column({ name: ColumnName.Board.language, default: "en" })
	language: string;

	@CreateDateColumn({ name: ColumnName.Global.createdAt })
	createdAt: Date;

	@CreateDateColumn({ name: ColumnName.Global.updatedAt })
	updatedAt: Date;

	@Column({ name: ColumnName.Board.isAnalyzed, default: false })
	isAnalyzed: boolean;

	@Column({ name: ColumnName.Account.id })
	accountId: number;

	@ManyToOne(() => AccountEntity)
	@JoinColumn({ name: ColumnName.Account.id })
	account: AccountEntity;
}
