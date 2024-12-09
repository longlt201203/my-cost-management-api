import { RecordRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { CreateRecordRequest, UpdateRecordRequest } from "./dto";
import { ClassTracing } from "magic-otel";
import { McmClsStore } from "@utils";
import { ClsService } from "nestjs-cls";
import { RecordNotFoundError } from "./errors";
import * as dayjs from "dayjs";
import { Between } from "typeorm";

@Injectable()
@ClassTracing()
export class RecordService {
	constructor(
		private readonly recordRepository: RecordRepository,
		private readonly cls: ClsService<McmClsStore>,
	) {}

	async create(dto: CreateRecordRequest) {
		const board = this.cls.get("board");
		const result = await this.recordRepository.save({
			content: dto.content,
			boardId: board.id,
			createdAt: new Date(),
		});
		return result;
	}

	async getAll() {
		const now = dayjs();
		const board = this.cls.get("board");
		return await this.recordRepository.find({
			where: {
				boardId: board.id,
				createdAt: Between(
					now.startOf("date").toDate(),
					now.endOf("date").toDate(),
				),
			},
		});
	}

	async delete(recordId: number) {
		await this.recordRepository.delete({
			id: recordId,
		});
	}

	async getOneOrFail(recordId: number) {
		const boardId = this.cls.get("board.id");
		const record = await this.recordRepository.findOne({
			where: {
				id: recordId,
				boardId: boardId,
			},
		});
		if (!record) throw new RecordNotFoundError();
		return record;
	}

	async update(recordId: number, dto: UpdateRecordRequest) {
		const record = await this.getOneOrFail(recordId);
		const result = await this.recordRepository.save({
			...record,
			content: dto.content,
		});
		return result;
	}
}
