import { registerDecorator, ValidationOptions } from "class-validator";
import * as dayjs from "dayjs";

export interface IsDateInRangeOptions {
	minDate?: () => Date;
	maxDate?: () => Date;
}

export function IsDateInRange(
	opts: IsDateInRangeOptions,
	validateOptions?: ValidationOptions,
): PropertyDecorator {
	return (target, propertyKey: string) => {
		registerDecorator({
			name: "isDateInRange",
			target: target.constructor,
			propertyName: propertyKey,
			options: validateOptions,
			constraints: [],
			validator: {
				validate(value: any) {
					try {
						const date = dayjs(value);
						if (opts.minDate && date.diff(dayjs(opts.minDate()), "date") < 0)
							return false;
						if (opts.maxDate && date.diff(dayjs(opts.maxDate()), "date") > 0)
							return false;
						return true;
					} catch (err) {
						console.log(err);
						return false;
					}
				},
			},
		});
	};
}
