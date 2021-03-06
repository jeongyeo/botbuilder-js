/**
 * @module adaptive-expressions
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import moment from 'moment';

import { Expression } from '../expression';
import { ExpressionEvaluator, ValueWithError } from '../expressionEvaluator';
import { ExpressionType } from '../expressionType';
import { FunctionUtils } from '../functionUtils';
import { InternalFunctionUtils } from '../functionUtils.internal';
import { MemoryInterface } from '../memory/memoryInterface';
import { Options } from '../options';
import { ReturnType } from '../returnType';

/**
 * Add a number of time units to a timestamp.
 */
export class AddToTime extends ExpressionEvaluator {
    public constructor() {
        super(ExpressionType.AddToTime, AddToTime.evaluator, ReturnType.String, AddToTime.validator);
    }

    private static evaluator(expression: Expression, state: MemoryInterface, options: Options): ValueWithError {
        let value: any;

        const { args, error: childrenError } = FunctionUtils.evaluateChildren(expression, state, options);
        let error = childrenError;
        if (!error) {
            const format: string =
                args.length === 4 ? FunctionUtils.timestampFormatter(args[3]) : FunctionUtils.DefaultDateTimeFormat;
            if (typeof args[0] === 'string' && Number.isInteger(args[1]) && typeof args[2] === 'string') {
                ({ value, error } = AddToTime.evalAddToTime(args[0], args[1], args[2], format));
            } else {
                error = `${expression} should contain an ISO format timestamp, a time interval integer, a string unit of time and an optional output format string.`;
            }
        }

        return { value, error };
    }

    private static evalAddToTime(
        timeStamp: string,
        interval: number,
        timeUnit: string,
        format?: string
    ): ValueWithError {
        let result: string;
        const { value: parsed, error: parseError } = InternalFunctionUtils.parseTimestamp(timeStamp);
        let error = parseError;
        if (!error) {
            const dt: any = moment(parsed).utc();
            let addedTime = dt;
            let timeUnitMark: string;
            switch (timeUnit) {
                case 'Second': {
                    timeUnitMark = 's';
                    break;
                }

                case 'Minute': {
                    timeUnitMark = 'm';
                    break;
                }

                case 'Hour': {
                    timeUnitMark = 'h';
                    break;
                }

                case 'Day': {
                    timeUnitMark = 'd';
                    break;
                }

                case 'Week': {
                    timeUnitMark = 'week';
                    break;
                }

                case 'Month': {
                    timeUnitMark = 'month';
                    break;
                }

                case 'Year': {
                    timeUnitMark = 'year';
                    break;
                }

                default: {
                    error = `${timeUnit} is not valid time unit`;
                    break;
                }
            }

            if (!error) {
                addedTime = dt.add(interval, timeUnitMark);
                ({ value: result, error } = InternalFunctionUtils.returnFormattedTimeStampStr(addedTime, format));
            }
        }

        return { value: result, error };
    }

    private static validator(expression: Expression): void {
        FunctionUtils.validateOrder(
            expression,
            [ReturnType.String],
            ReturnType.String,
            ReturnType.Number,
            ReturnType.String
        );
    }
}
