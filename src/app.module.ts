import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_PIPE } from "@nestjs/core";
import { MyExceptionFilter, ValidationPipe } from "@utils";
import { DbModule } from "@db";
import { AccountModule } from "@modules/account";
import { AuthGuard, AuthModule } from "@modules/auth";
import { ClsModule } from "nestjs-cls";
import { BoardModule } from "@modules/board";
import { RecordModule } from "@modules/record";
import { AnalysisModule } from "@modules/analysis";
import { ServeStaticModule } from "@nestjs/serve-static";
import { FrontModule } from "@modules/front";
import { CategoryModule } from "@modules/category";

import * as fs from "fs";
import * as path from "path";
const staticFolder = path.resolve(__dirname, "../public");
if (!fs.existsSync(staticFolder)) fs.mkdirSync(staticFolder);

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: staticFolder,
		}),
		ClsModule.forRoot({
			global: true,
			middleware: {
				mount: true,
			},
		}),
		DbModule,
		AccountModule,
		AuthModule,
		BoardModule,
		RecordModule,
		AnalysisModule,
		FrontModule,
		CategoryModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_FILTER,
			useClass: MyExceptionFilter,
		},
		{
			provide: APP_PIPE,
			useClass: ValidationPipe,
		},
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
