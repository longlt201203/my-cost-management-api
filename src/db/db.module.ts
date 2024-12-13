import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { datasource } from "./datasource";
import { addTransactionalDataSource } from "typeorm-transactional";
import {
	AccountRepository,
	BoardRepository,
	RecordRepository,
	ExtractedRecordRepository,
	DailyAnalysisRepository,
	MonthlyAnalysisRepository,
	YearlyAnalysisRepository,
} from "./repositories";

const repositories = [
	AccountRepository,
	BoardRepository,
	RecordRepository,
	ExtractedRecordRepository,
	DailyAnalysisRepository,
	MonthlyAnalysisRepository,
	YearlyAnalysisRepository,
];

@Global()
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: async () => datasource.options,
			dataSourceFactory: async () => addTransactionalDataSource(datasource),
		}),
	],
	providers: [...repositories],
	exports: [...repositories],
})
export class DbModule {}
