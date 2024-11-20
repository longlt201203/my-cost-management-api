import { AccountEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { ClassTracing } from "magic-otel";
import { DataSource, Repository } from "typeorm";

@Injectable()
@ClassTracing()
export class AccountRepository extends Repository<AccountEntity> {
	constructor(datasource: DataSource) {
		super(AccountEntity, datasource.createEntityManager());
	}
}
