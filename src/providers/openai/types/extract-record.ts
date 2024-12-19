import { z } from "zod";

export const ExtractRecordResponseSchema = z.object({
	recordId: z.number(),
	description: z.string(),
	amount: z.number(),
	paymentMethod: z.string().nullable(),
	location: z.string().nullable(),
	notes: z.string().nullable(),
	categories: z.array(z.number()),
});

export type ExtractRecordResponse = z.infer<typeof ExtractRecordResponseSchema>;
