import { Injectable } from "@nestjs/common";
import { McmClsStore } from "@utils";
import { ClassTracing } from "magic-otel";
import { ClsService } from "nestjs-cls";
import {
	CreateBoardRequest,
	GetDailyAnalysisQuery,
	UpdateBoardRequest,
} from "./dto";
import { BoardRepository } from "@db/repositories";
import { ValidationError } from "class-validator";
import { ApiValidationError } from "@errors";
import { Not } from "typeorm";
import { BoardNotFoundError } from "./errors";
import { AnalysisService } from "@modules/analysis";
import * as dayjs from "dayjs";

@Injectable()
@ClassTracing()
export class BoardService {
	constructor(
		private readonly cls: ClsService<McmClsStore>,
		private readonly boardRepository: BoardRepository,
		private readonly analysisService: AnalysisService,
	) {}

	async validateBeforeCreate(dto: CreateBoardRequest, accountId: number) {
		const errors = [];
		const isTitleExists = await this.isTitleExists(dto.title, accountId);

		if (isTitleExists) {
			const error = new ValidationError();
			error.property = "title";
			error.constraints = {
				isTitleExists: "Title already exists",
			};
			errors.push(error);
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	async validateBeforeUpdate(
		boardId: number,
		dto: UpdateBoardRequest,
		accountId: number,
	) {
		const errors = [];
		const isTitleExists = await this.isTitleExists(
			dto.title,
			accountId,
			boardId,
		);

		if (isTitleExists) {
			const error = new ValidationError();
			error.property = "title";
			error.constraints = {
				isTitleExists: "Title already exists",
			};
			errors.push(error);
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	async isTitleExists(title: string, accountId: number, boardId?: number) {
		const count = await this.boardRepository.count({
			where: {
				title: title,
				accountId: accountId,
				id: boardId && Not(boardId),
			},
		});
		return count > 0;
	}

	async create(dto: CreateBoardRequest) {
		const accountId = this.cls.get("account.id");
		await this.validateBeforeCreate(dto, accountId);
		return await this.boardRepository.save({
			title: dto.title,
			currencyUnit: dto.currencyUnit,
			language: dto.language,
			accountId: accountId,
		});
	}

	async getAll() {
		const accountId = this.cls.get("account.id");
		return await this.boardRepository.find({
			where: {
				accountId: accountId,
				isDeleted: false,
			},
		});
	}

	getClsBoard() {
		const board = this.cls.get("board");
		return board;
	}

	async getOneOrFail(boardId: number) {
		const accountId = this.cls.get("account.id");
		const board = await this.boardRepository.findOne({
			where: {
				id: boardId,
				accountId: accountId,
				isDeleted: false,
			},
		});
		if (!board) {
			throw new BoardNotFoundError();
		}
		return board;
	}

	async update(dto: UpdateBoardRequest) {
		const boardId = this.cls.get("board.id");
		const [board, _] = await Promise.all([
			this.getOneOrFail(boardId),
			this.validateBeforeUpdate(boardId, dto, this.cls.get("account.id")),
		]);

		return await this.boardRepository.save({
			...board,
			title: dto.title,
			updatedAt: new Date(),
		});
	}

	async delete() {
		const boardId = this.cls.get("board.id");
		await this.boardRepository.update(
			{
				id: boardId,
			},
			{
				isDeleted: true,
			},
		);
	}

	async getDailyAnalysis(query: GetDailyAnalysisQuery) {
		const board = this.cls.get("board");
		const date = query.date || dayjs();
		let [analysis, extractedRecords] = await Promise.all([
			this.analysisService.getDailyAnalysis(board.id, date),
			this.analysisService.getDailyExtractedRecord(board.id, date),
		]);
		if (!analysis) {
			await this.analysisService.analyzeBoardDaily(board, date);
			[analysis, extractedRecords] = await Promise.all([
				this.analysisService.getDailyAnalysis(board.id, date),
				this.analysisService.getDailyExtractedRecord(board.id, date),
			]);
		}
		return { analysis, extractedRecords };
	}
}
