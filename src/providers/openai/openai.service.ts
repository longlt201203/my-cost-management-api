import { Injectable } from "@nestjs/common";
import { Env } from "@utils";
import { ClassTracing } from "magic-otel";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { ExtractRecordResponseSchema } from "./types";
import { OPENAI_SYSTEM_MESSAGES } from "./openai.constants";

@Injectable()
@ClassTracing()
export class OpenAIService {
	private readonly openai: OpenAI;
	constructor() {
		this.openai = new OpenAI({
			apiKey: Env.OPEN_AI_API_KEY,
		});
	}

	async analyzeDiary(
		content: string,
		currencyUnit: string,
		categories: string[],
	) {
		const schema = z.object({
			result: z.array(ExtractRecordResponseSchema),
		});
		const completion = await this.openai.chat.completions.create({
			model: "gpt-4o-2024-08-06",
			messages: [
				{
					role: "system",
					content: OPENAI_SYSTEM_MESSAGES.ANALYZE_DIARY(
						currencyUnit,
						categories,
					),
				},
				{
					role: "user",
					content: content,
				},
			],
			response_format: zodResponseFormat(schema, "extractRecords"),
		});
		const raw = completion.choices[0].message.content;
		const parsed = schema.parse(JSON.parse(raw));
		return parsed;
	}
}
