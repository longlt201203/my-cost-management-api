import { Module } from "@nestjs/common";
import { RecordController } from "./record.controller";
import { RecordService } from "./record.service";
import { BoardModule } from "@modules/board";
import { AnalysisModule } from "@modules/analysis";

@Module({
	imports: [BoardModule, AnalysisModule],
	controllers: [RecordController],
	providers: [RecordService],
})
export class RecordModule {}
