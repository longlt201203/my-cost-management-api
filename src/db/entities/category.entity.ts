import { DbConstants } from "@db/db.constants";
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { AccountEntity } from "./account.entity";

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

	@Column({ name: ColumnName.Account.id, nullable: true })
	accountId: number;

	@ManyToOne(() => AccountEntity, { nullable: true })
	@JoinColumn({ name: ColumnName.Account.id })
	account: AccountEntity;
}
