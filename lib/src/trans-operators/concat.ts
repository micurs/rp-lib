import type { Observable, Operator } from '../index.ts';
import { Subject } from '../index.ts';

/**
 * A concat operator that concatenates the output of two observables,
 * emitting values from the first observable and then emitting the
 * values from the second observable.
 * @param secondSource$ - the second observable
 * @param firstSource$ - the first observable
 * @returns a new observable that concatenates the output of two observables.
 */
export const concat =
  <I1, I2>(secondSource$: Observable<I2>): Operator<I1, I1 | I2> =>
  (firstSource$: Observable<I1>): Observable<I1 | I2> => {
    const result$ = new Subject<I1 | I2>();
    const secondSourceCache: Array<I2> = [];

    // Subscribe to the second observable and cache its
    // values until the first observable completes
    secondSource$.subscribe({
      next: (value: I2) => {
        if (firstSource$.isCompleted) {
          result$.emit(value);
        } else {
          secondSourceCache.push(value);
        }
      },
      error: (err: Error) => result$.error(err),
      complete: () => firstSource$.isCompleted && result$.complete(),
    });

    // Subscribe to the first observable and emit its values to the
    // result observable when it completes, we emit all cached values
    // from the second observable
    firstSource$.subscribe({
      next: (value: I1) => result$.emit(value),
      error: (err: Error) => result$.error(err),
      complete: () => {
        // Now we emit all cached values from the second observable
        secondSourceCache.forEach((value: I2) => result$.emit(value));
        // If the second observable has completed, we complete the result observable
        secondSource$.isCompleted && result$.complete();
      },
    });
    return result$;
  };
