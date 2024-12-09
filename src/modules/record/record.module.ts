import { Module } from "@nestjs/common";
import { RecordController } from "./record.controller";
import { RecordService } from "./record.service";
import { BoardModule } from "@modules/board";

@Module({
	imports: [BoardModule],
	controllers: [RecordController],
	providers: [RecordService],
})
export class RecordModule {}
