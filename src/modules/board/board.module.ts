import { Module } from "@nestjs/common";
import { BoardController } from "./board.controller";
import { BoardService } from "./board.service";
import { AnalysisModule } from "@modules/analysis";

@Module({
	controllers: [BoardController],
	providers: [BoardService],
	exports: [BoardService],
	imports: [AnalysisModule],
})
export class BoardModule {}
