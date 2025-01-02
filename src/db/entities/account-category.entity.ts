import { DbConstants } from "@db/db.constants";
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { AccountEntity } from "./account.entity";

const { TableName, ColumnName } = DbConstants;

@Entity(TableName.AccountCategory)
export class AccountCategoryEntity {
	@PrimaryGeneratedColumn("increment", {
		name: ColumnName.AccountCategory.id,
	})
	id: number;

	@Column({ name: ColumnName.Account.id })
	accountId: number;

	@ManyToOne(() => AccountEntity)
	@JoinColumn({ name: ColumnName.Account.id })
	account: AccountEntity;

	@Column({ name: ColumnName.Category.name })
	name: string;

	@Column({ name: ColumnName.Category.language, default: "en" })
	language: string;

	@Column({ name: ColumnName.Category.color, nullable: true })
	color: string;
}
