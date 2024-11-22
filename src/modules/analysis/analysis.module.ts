import { Module } from "@nestjs/common";
import { AnalysisController } from "./analysis.controller";
import { AnalysisService } from "./analysis.service";
import { OpenAIModule } from "@providers/openai";

@Module({
	imports: [OpenAIModule],
	controllers: [AnalysisController],
	providers: [AnalysisService],
	exports: [AnalysisService],
})
export class AnalysisModule {}
