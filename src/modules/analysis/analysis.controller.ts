import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AnalysisService } from "./analysis.service";

@Controller("analysis")
@ApiTags("analysis")
export class AnalysisController {
	constructor(private readonly analysisService: AnalysisService) {}
}
