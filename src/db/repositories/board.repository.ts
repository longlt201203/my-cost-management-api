import { BoardEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { ClassTracing } from "magic-otel";
import { DataSource, Repository } from "typeorm";

@Injectable()
@ClassTracing()
export class BoardRepository extends Repository<BoardEntity> {
	constructor(datasource: DataSource) {
		super(BoardEntity, datasource.createEntityManager());
	}
}
