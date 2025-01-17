export const DbConstants = {
	TableName: {
		Account: "account",
		Board: "board",
		Record: "record",
		ExtractedRecord: "extracted_record",
		Category: "category",
		ExtractedRecordCategory: "extracted_record_category",
		DailyAnalysis: "daily_analysis",
		MonthlyAnalysis: "monthly_analysis",
		YearlyAnalysis: "yearly_analysis",
	},

	ColumnName: {
		Global: {
			createdAt: "created_at",
			updatedAt: "updated_at",
			isDeleted: "is_deleted",
		},

		Account: {
			id: "account_id",
			email: "email",
			phone: "phone",
			password: "password",
		},

		Board: {
			id: "board_id",
			title: "title",
			currencyUnit: "currency_unit",
			isAnalyzed: "is_analyzed",
			language: "language",
		},

		Record: {
			id: "record_id",
			content: "content",
		},

		ExtractedRecord: {
			id: "extracted_record_id",
			time: "time",
			description: "description",
			amount: "amount",
			paymentMethod: "payment_method",
			location: "location",
			notes: "notes",
		},

		Category: {
			id: "category_id",
			name: "name",
			language: "language",
			color: "color",
		},

		ExtractedRecordCategory: {
			id: "extracted_record_category_id",
		},

		DailyAnalysis: {
			id: "daily_analysis_id",
			date: "date",
			month: "month",
			year: "year",
			total: "total",
		},

		MonthlyAnalysis: {
			id: "monthly_analysis_id",
			month: "month",
			year: "year",
			total: "total",
			dailyAvg: "daily_avg",
			median: "median",
			variant: "variant",
		},
		YearlyAnalysis: {
			id: "yearly_analysis_id",
			year: "year",
			total: "total",
			monthAvg: "month_avg",
			median: "median",
			variant: "variant",
		},
	},
} as const;
