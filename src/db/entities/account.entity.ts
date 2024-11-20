import { DbConstants } from "@db/db.constants";
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm";

const { TableName, ColumnName } = DbConstants;

@Entity(TableName.Account)
export class AccountEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnName.Account.id })
	id: number;

	// unique
	@Column({ name: ColumnName.Account.email })
	email: string;

	// unique
	@Column({ name: ColumnName.Account.phone })
	phone: string;

	@Column({ name: ColumnName.Account.password })
	password: string;

	@CreateDateColumn({ name: ColumnName.Global.createdAt })
	createdAt: Date;

	@CreateDateColumn({ name: ColumnName.Global.updatedAt })
	updatedAt: Date;
}
