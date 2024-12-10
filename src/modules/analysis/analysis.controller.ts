import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AnalysisService } from "./analysis.service";
import { ManualAnalyzeBoardDailyRequest } from "./dto";
import { ApiResponseDto } from "@utils";

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
}
