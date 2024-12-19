export class PromiseAllHandler {
	private promises: Promise<any>[] = [];
	constructor(
		private readonly each: number,
		private readonly delay: number,
	) {}

	push(promise: Promise<any>) {
		this.promises.push(promise);
	}

	async execute() {
		const results = [];

		const n = Math.ceil(this.promises.length / this.each);
		for (let i = 0; i < n; i++) {
			const start = i * this.each;
			const end = Math.min((i + 1) * this.each, this.promises.length);
			const promises = this.promises.slice(start, end);

			const resultsPart = await Promise.all(promises);
			results.push(...resultsPart);

			if (i < n - 1) {
				await new Promise((resolve) => setTimeout(resolve, this.delay));
			}
		}

		return results;
	}
}
