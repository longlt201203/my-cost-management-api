export const OPENAI_SYSTEM_MESSAGES = {
	ANALYZE_DIARY: (currencyUnit: string) =>
		`You will me given some records of a user diary for daily expenses. You need to extract the datetime, description, amount (${currencyUnit}), payment method, location, and notes from the records.`,
} as const;
