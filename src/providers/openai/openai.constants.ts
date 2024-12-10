export const OPENAI_SYSTEM_MESSAGES = {
	ANALYZE_DIARY: (currencyUnit: string) =>
		`You will be given some records of a user diary for daily expenses. You need to extract the datetime, description, amount (${currencyUnit}), payment method, location, and notes from the records. Note that when a record has multiple amounts, you should sum them up and provide details in notes. For instance: "Coffee 2.5$, Cake 3.5$", the record should has amount 6$ and notes "Coffee 2.5$, Cake 3.5$".`,
} as const;
