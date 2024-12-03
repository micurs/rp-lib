import type { Observable, Operator } from "./types.ts";

/**
 * Compose a series of operators into a single operator.
 * @param operators - A series of operators to compose.
 * @returns A single operator that is the composition of the input operators.
 */
export function pipe<I, O1, O>(
  op1: Operator<I, O1>,
  op2: Operator<O1, O>,
): Operator<I, O>;
export function pipe<I, O1, O2, O>(
  op1: Operator<I, O1>,
  op2: Operator<O1, O2>,
  op3: Operator<O2, O>,
): Operator<I, O>;
export function pipe<I, O1, O2, O3, O>(
  op1: Operator<I, O1>,
  op2: Operator<O1, O2>,
  op3: Operator<O2, O3>,
  op4: Operator<O3, O>,
): Operator<I, O>;
export function pipe(
  ...operators: Operator<unknown, unknown>[]
): Operator<unknown, unknown> {
  return (source: Observable<unknown>): Observable<unknown> => {
    return operators.reduce((acc, operator) => operator(acc), source);
  };
}

/**
 * Compose a series of operators into a single operator.
 * Note: this is similar to `pipe` however the operators are applied in reverse order,
 * that is the first operator in the array is applied last.
 * @param operators - A series of operators to compose.
 * @returns A single operator that is the composition of the input operators.
 */
export function compose<I, O1, O>(
  op1: Operator<O1, O>,
  op2: Operator<I, O1>,
): Operator<I, O>;
export function compose<I, O1, O2, O>(
  op1: Operator<O2, O>,
  op2: Operator<O1, O2>,
  op3: Operator<I, O1>,
): Operator<I, O>;
export function compose<I, O1, O2, O3, O>(
  op1: Operator<O3, O>,
  op2: Operator<O2, O3>,
  op3: Operator<O1, O2>,
  op4: Operator<I, O1>,
): Operator<I, O>;
export function compose(
  ...operators: Operator<unknown, unknown>[]
): Operator<unknown, unknown> {
  return (source: Observable<unknown>): Observable<unknown> => {
    return operators.reduceRight((acc, operator) => operator(acc), source);
  };
}
