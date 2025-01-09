import { BoardEntity, ExtractedRecordEntity } from "@db/entities";
import {
	AnalysisRepository,
	BoardRepository,
	CategoryRepository,
	DailyAnalysisRepository,
	ExtractedRecordRepository,
	MonthlyAnalysisRepository,
	RecordRepository,
	YearlyAnalysisRepository,
} from "@db/repositories";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { OpenAIService } from "@providers/openai";
import { ClassTracing } from "magic-otel";
import { Between } from "typeorm";
import {
	NoAnalysisFoundError,
	NoMonthlyFoundError,
	NoRecordFoundError,
	NoYearlyFoundError,
} from "./errors";
import * as dayjs from "dayjs";
import {
	ManualAnalyzeBoardDailyRequest,
	ManualAnalyzeBoardMonthlyRequest,
} from "./dto";
import { McmClsStore, PromiseAllHandler, redisClient } from "@utils";
import { ClsService } from "nestjs-cls";
import { BoardNotFoundError } from "@modules/board/errors";
import { ManualAnalyzeBoardYearlyRequest } from "./dto/manual-analyze-board-yearly.request";

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
		private readonly monthlyAnalysisRepository: MonthlyAnalysisRepository,
		private readonly yearlyAnalysisRepository: YearlyAnalysisRepository,
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
		if (records.length === 0) {
			await this.dailyAnalysisRepository.save({
				date: date.get("date"),
				month: date.get("month") + 1,
				year: date.get("year"),
				boardId: board.id,
				total: 0,
				createdAt: date.toDate(),
			});
			return;
		}
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
			month: date.get("month") + 1,
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

	async getMonthlyChartData(
		boardId: number,
		date: dayjs.Dayjs,
		timezone?: string,
	) {
		const month = date.get("month") + 1;
		const year = date.get("year");
		const records = await this.dailyAnalysisRepository.find({
			where: {
				boardId: boardId,
				year: year,
				month: month,
			},
		});
		if (!records) throw new NoAnalysisFoundError();
		const dataChart = Array(date.daysInMonth()).fill(0);
		records.forEach((record) => (dataChart[record.date - 1] = record.total));
		return dataChart;
	}

	async getMonthlyAnalysis(
		boardId: number,
		date: dayjs.Dayjs,
		timezone?: string,
	) {
		const month = date.get("month") + 1;
		const year = date.get("year");
		const analysis = await this.monthlyAnalysisRepository.findOne({
			where: {
				boardId: boardId,
				year: year,
				month: month,
			},
		});
		if (!analysis) throw new NoAnalysisFoundError();
		return analysis;
	}

	async manualAnalyzeBoardMonthly(dto: ManualAnalyzeBoardMonthlyRequest) {
		const accountId = this.cls.get("account.id");
		const board = await this.boardRepository.findOne({
			where: {
				id: dto.boardId,
				accountId: accountId,
			},
		});
		if (!board) throw new BoardNotFoundError();
		await this.analyzeBoardMonthly(board, dto.date, dto.timezone);
	}

	async analyzeBoardMonthly(
		board: BoardEntity,
		date: dayjs.Dayjs,
		timezone?: string,
	) {
		const startMonth = dayjs.tz(date.startOf("month"), timezone);
		const endMonth = dayjs.tz(date.endOf("month"), timezone);

		const month = date.get("month") + 1;
		const year = date.get("year");

		const records = await this.dailyAnalysisRepository.find({
			where: {
				boardId: board.id,
				year: year,
				month: month,
			},
		});
		if (records.length === 0) throw new NoMonthlyFoundError();
		await Promise.all([
			this.monthlyAnalysisRepository.delete({
				boardId: board.id,
				year: year,
				month: month,
			}),
		]);

		let total = 0;
		for (const record of records) {
			total += record.total;
		}
		const dailyAvg = total / records.length;

		await this.monthlyAnalysisRepository.save({
			dailyAvg: dailyAvg,
			month: month,
			year: year,
			total: total,
			median: 0,
			variant: 0,
			boardId: board.id,
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

	async getYearlyChartData(
		boardId: number,
		date: dayjs.Dayjs,
		timezone?: string,
	) {
		const year = date.get("year");
		const records = await this.monthlyAnalysisRepository.find({
			where: {
				boardId: boardId,
				year: year,
			},
		});
		if (!records) throw new NoYearlyFoundError();
		const dataChart = Array(12).fill(0);
		records.forEach(
			(records) => (dataChart[records.month - 1] = records.total),
		);
		return dataChart;
	}

	async getYearlyAnalysis(
		boardId: number,
		date: dayjs.Dayjs,
		timezone?: string,
	) {
		const year = date.get("year");
		const analysis = await this.yearlyAnalysisRepository.findOne({
			where: {
				year: year,
				board: boardId,
			},
		});
		console.log(analysis);
		if (!analysis) throw new NoAnalysisFoundError();
		return analysis;
	}

	async manualAnalyzeBoardYearly(dto: ManualAnalyzeBoardYearlyRequest) {
		const accountId = this.cls.get("account.id");
		const board = await this.boardRepository.findOne({
			where: {
				id: dto.boardId,
				accountId: accountId,
			},
		});
		if (!board) throw new BoardNotFoundError();
		await this.analyzeBoardYearly(board, dto.date, dto.timezone);
	}

	async analyzeBoardYearly(
		board: BoardEntity,
		date: dayjs.Dayjs,
		timezone?: string,
	) {
		const year = date.get("year");

		const records = await this.monthlyAnalysisRepository.find({
			where: {
				boardId: board.id,
				year: year,
			},
		});
		if (records.length === 0) throw new NoYearlyFoundError();
		await Promise.all([
			this.yearlyAnalysisRepository.delete({
				board: board.id,
				year: year,
			}),
		]);

		let total = 0;
		for (const record of records) {
			total += record.total;
		}
		const monthAvg = total / records.length;

		await this.yearlyAnalysisRepository.save({
			year: year,
			monthAvg: monthAvg,
			total: total,
			median: 0,
			variant: 0,
			board: board.id,
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
