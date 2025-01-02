import { BoardEntity, ExtractedRecordEntity } from "@db/entities";
import {
	AnalysisRepository,
	BoardRepository,
	CategoryRepository,
	DailyAnalysisRepository,
	ExtractedRecordRepository,
	RecordRepository,
} from "@db/repositories";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { OpenAIService } from "@providers/openai";
import { ClassTracing } from "magic-otel";
import { Between } from "typeorm";
import { NoAnalysisFoundError, NoRecordFoundError } from "./errors";
import * as dayjs from "dayjs";
import { ManualAnalyzeBoardDailyRequest } from "./dto";
import { McmClsStore, PromiseAllHandler, redisClient } from "@utils";
import { ClsService } from "nestjs-cls";
import { BoardNotFoundError } from "@modules/board/errors";

@Injectable()
@ClassTracing()
export class AnalysisService implements OnModuleInit {
	constructor(
		private readonly openaiService: OpenAIService,
		private readonly recordRepository: RecordRepository,
		private readonly extractedRecordRepository: ExtractedRecordRepository,
		private readonly dailyAnalysisRepository: DailyAnalysisRepository,
		private readonly boardRepository: BoardRepository,
		private readonly categoryRepository: CategoryRepository,
		private readonly analysisRepository: AnalysisRepository,
		private readonly cls: ClsService<McmClsStore>,
	) {}

	async onModuleInit() {
		const sub = redisClient.duplicate();
		await sub.connect();
		sub.pSubscribe("__keyevent@0__:expired", async (message, channel) => {
			console.log("Received message:", message, "from channel:", channel);
			const [_, boardId, date] = message.split(":");
			const board = await this.boardRepository.findOne({
				where: {
					id: parseInt(boardId),
				},
			});
			if (!board) return;
			await this.analyzeBoardDaily(board, dayjs(date));
		});
	}

	async getDailyAnalysis(
		boardId: number,
		date: dayjs.Dayjs,
		timezone?: string,
	) {
		const startDate = dayjs.tz(date.startOf("date"), timezone);
		const endDate = dayjs.tz(date.endOf("date"), timezone);
		const analysis = await this.dailyAnalysisRepository.findOne({
			where: {
				boardId: boardId,
				createdAt: Between(startDate.toDate(), endDate.toDate()),
			},
		});
		if (!analysis) throw new NoAnalysisFoundError();
		return analysis;
	}

	async getDailyExtractedRecord(
		boardId: number,
		date: dayjs.Dayjs,
		timezone?: string,
	) {
		const startDate = dayjs.tz(date.startOf("date"), timezone);
		const endDate = dayjs.tz(date.endOf("date"), timezone);
		return await this.extractedRecordRepository.findWithCategories({
			boardId: boardId,
			time: Between(startDate.toDate(), endDate.toDate()),
		});
	}

	async manualAnalyzeBoardDaily(dto: ManualAnalyzeBoardDailyRequest) {
		const accountId = this.cls.get("account.id");
		const board = await this.boardRepository.findOne({
			where: {
				id: dto.boardId,
				accountId: accountId,
			},
		});
		if (!board) throw new BoardNotFoundError();
		await this.analyzeBoardDaily(board, dto.date, dto.timezone);
	}

	async analyzeBoardDaily(
		board: BoardEntity,
		date: dayjs.Dayjs,
		timezone?: string,
	) {
		const startDate = dayjs.tz(date.startOf("date"), timezone);
		const endDate = dayjs.tz(date.endOf("date"), timezone);

		const records = await this.recordRepository.find({
			where: {
				boardId: board.id,
				createdAt: Between(startDate.toDate(), endDate.toDate()),
			},
		});
		if (records.length === 0) throw new NoRecordFoundError();
		const recordTimeMap = {};
		const contentArr = [];
		for (const record of records) {
			recordTimeMap[record.id] = record.createdAt;
			contentArr.push(`Record ${record.id}: ${record.content}`);
		}
		await this.analysisRepository.cleanUpDailyAnalysis(
			board.id,
			date,
			timezone,
		);
		const categories = await this.categoryRepository.find({
			where: {
				language: board.language,
			},
		});
		const extracted = await this.openaiService.analyzeDiary(
			contentArr.join("\n"),
			board.currencyUnit,
			categories.map((item) => `${item.id} - ${item.name}`),
		);
		const handler = new PromiseAllHandler(10, 50);
		for (const item of extracted.result) {
			handler.push(
				this.extractedRecordRepository.createWithCategories(
					{
						boardId: board.id,
						time: recordTimeMap[item.recordId],
						recordId: item.recordId,
						description: item.description,
						amount: item.amount,
						paymentMethod: item.paymentMethod,
						location: item.location,
						notes: item.notes,
					},
					item.categories || [],
				),
			);
		}
		const extractedRecords =
			(await handler.execute()) as ExtractedRecordEntity[];
		let total = 0;
		for (const record of extractedRecords) {
			total += record.amount;
		}
		await this.dailyAnalysisRepository.save({
			date: date.get("date"),
			month: date.get("month"),
			year: date.get("year"),
			boardId: board.id,
			total: total,
			createdAt: date.toDate(),
		});
		await this.boardRepository.update(
			{
				id: board.id,
			},
			{
				isAnalyzed: true,
			},
		);
	}
}
