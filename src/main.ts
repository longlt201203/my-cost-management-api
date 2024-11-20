import { Env } from "@utils";
import { registerOpentelemetry } from "magic-otel";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";
registerOpentelemetry({
	serviceName: "mcm-api",
	traceExporter: new ZipkinExporter({
		url: Env.ZIPKIN_URL,
		serviceName: "mcm-api",
	}),
	autoInstrumentations: {
		"@opentelemetry/instrumentation-http": {
			ignoreIncomingRequestHook: (req) =>
				!req.url.startsWith("/api") || req.url.startsWith("/api/docs"),
		},
	},
});

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { initializeTransactionalContext } from "typeorm-transactional";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
	initializeTransactionalContext();

	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix("/api");
	app.enableCors({ origin: "*" });
	app.use(helmet());

	if (Env.ENABLE_SWAGGER) {
		const config = new DocumentBuilder()
			.setTitle("API Documentation")
			.setDescription("API Description")
			.setVersion("1.0")
			.addBearerAuth()
			.build();
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup("api/docs", app, document);
	}

	await app.listen(Env.LISTEN_PORT);
}
bootstrap();