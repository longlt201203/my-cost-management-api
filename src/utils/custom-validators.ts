import { TransformFnParams } from "class-transformer";
import { registerDecorator, ValidationOptions } from "class-validator";
import * as dayjs from "dayjs";

export interface IsDayjsInRangeOptions {
	minDate?: () => dayjs.Dayjs;
	maxDate?: () => dayjs.Dayjs;
}

export function IsDayjsInRange(
	opts: IsDayjsInRangeOptions,
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
						if (opts.minDate && date.diff(opts.minDate(), "date") < 0)
							return false;
						if (opts.maxDate && date.diff(opts.maxDate(), "date") > 0)
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

export function IsDayjs(otps?: ValidationOptions): PropertyDecorator {
	return (target, propertyKey: string) => {
		registerDecorator({
			name: "isDayjs",
			target: target.constructor,
			propertyName: propertyKey,
			constraints: [],
			options: otps,
			validator: {
				validate(value: any) {
					return dayjs(value).isValid();
				},
			},
		});
	};
}

export function transformToDayjs({ value }: TransformFnParams) {
	return dayjs(value);
}
