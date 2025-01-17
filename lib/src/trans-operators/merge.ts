import type { Observable, Operator } from '../index.ts';
import { Subject } from '../index.ts';

/**
 * A merge operator that merges two observables, emitting values from both
 * observable and completing when both observables have completed.
 * @param secondSource$ - the second observable
 * @param firstSource$ - the first observable
 * @returns a new observable that emits values from both observables and completes when both have completed.
 */
export const merge =
  <I1, I2>(secondSource$: Observable<I2>): Operator<I1, I1 | I2> =>
  (firstSource$: Observable<I1>): Observable<I1 | I2> => {
    const result$ = new Subject<I1 | I2>((out$) => {
      firstSource$.subscribe({
        next: (value: I1) => out$.emit(value),
        error: (err: Error) => out$.error(err),
        complete: () => secondSource$.isCompleted && out$.complete(),
      });
      secondSource$.subscribe({
        next: (value: I2) => out$.emit(value),
        error: (err: Error) => out$.error(err),
        complete: () => firstSource$.isCompleted && out$.complete(),
      });
    });
    return result$;
  };
