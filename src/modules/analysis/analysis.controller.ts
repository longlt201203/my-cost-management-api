import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AnalysisService } from "./analysis.service";
import {
	ManualAnalyzeBoardDailyRequest,
	ManualAnalyzeBoardMonthlyRequest,
	MonthlyAnalysisResponse,
} from "./dto";
import { ApiResponseDto } from "@utils";
import { ManualAnalyzeBoardYearlyRequest } from "./dto/manual-analyze-board-yearly.request";
import { YearlyAnalysisResponse } from "./dto/yearly-analysis.response";

@Controller("analysis")
@ApiTags("analysis")
@ApiBearerAuth()
export class AnalysisController {
	constructor(private readonly analysisService: AnalysisService) {}

	@Post("daily")
	async analyze(@Body() dto: ManualAnalyzeBoardDailyRequest) {
		await this.analysisService.manualAnalyzeBoardDaily(dto);
		return new ApiResponseDto(null, null, "Success!");
	}

	@Post("monthly/chart")
	async monthlyChart(@Body() dto: ManualAnalyzeBoardDailyRequest) {
		const dataChart = await this.analysisService.getMonthlyChartData(
			dto.boardId,
			dto.date,
			dto.timezone,
		);
		return new ApiResponseDto({ charts: dataChart }, null, "Success!");
	}

	@Post("monthly")
	async monthlytAnalyze(@Body() dto: ManualAnalyzeBoardMonthlyRequest) {
		await this.analysisService.manualAnalyzeBoardMonthly(dto);
		const analysis = await this.analysisService.getMonthlyAnalysis(
			dto.boardId,
			dto.date,
			dto.timezone,
		);
		return new ApiResponseDto(
			MonthlyAnalysisResponse.fromEntity(analysis),
			null,
			"Success!",
		);
	}

	@Post("yearly/chart")
	async yearlyChart(@Body() dto: ManualAnalyzeBoardYearlyRequest) {
		const dataChart = await this.analysisService.getYearlyChartData(
			dto.boardId,
			dto.date,
			dto.timezone,
		);
		return new ApiResponseDto({ charts: dataChart }, null, "Success!");
	}

	@Post("yearly")
	async yearlyAnalyze(@Body() dto: ManualAnalyzeBoardYearlyRequest) {
		await this.analysisService.manualAnalyzeBoardYearly(dto);
		const analysis = await this.analysisService.getYearlyAnalysis(
			dto.boardId,
			dto.date,
			dto.timezone,
		);
		return new ApiResponseDto(
			YearlyAnalysisResponse.fromEntity(analysis),
			null,
			"Success!",
		);
	}
}
