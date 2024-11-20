import { z } from "zod";

export const ExtractRecordResponseSchema = z.object({
	recordId: z.number(),
	recordTime: z
		.string()
		.nullable()
		.transform((val) => (val ? new Date(val) : null)),
	description: z.string(),
	amount: z.number(),
	paymentMethod: z.string().nullable(),
	location: z.string().nullable(),
	notes: z.string().nullable(),
});

export type ExtractRecordResponse = z.infer<typeof ExtractRecordResponseSchema>;
