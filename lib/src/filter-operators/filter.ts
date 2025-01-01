import type { Observable, Operator } from '../index.ts';
import { Subject } from '../index.ts';

export type Predicate<T> = (value: T, idx: number) => boolean;

/**
 * The filter operator create a new observable that emits only the
 * values from the source observable that satisfy a predicate function.
 * @param predicate - a function that returns true if the value should be emitted
 * @returns the new observable that emits only the values that satisfy the predicate
 */
export const filter = <T>(predicate: Predicate<T>): Operator<T, T> => {
  return (source$: Observable<T>): Observable<T> => {
    let count = 0;
    const result$ = new Subject<T>();
    result$.onSubscribe(() => {
      source$.subscribe({
        next: (value: T) => {
          if (predicate(value, count++)) {
            result$.emit(value);
          }
        },
        error: (err) => result$.error(err),
        complete: () => result$.complete(),
      }, true);
    });
    return result$;
  };
};
