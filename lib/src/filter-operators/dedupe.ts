import { Subject } from '../observable.ts';
import type { Observable, Operator } from '../types.ts';

/**
 * An operator that filter two consecutive values that are equal (by reference or value for primitive types).
 * @returns the operator that filters out consecutive equal values
 */
export const dedupe = <T>(): Operator<T, T> => (source$: Observable<T>): Observable<T> => {
  let lastValue: T | undefined = undefined;
  const result$ = new Subject<T>(() => {
    source$.subscribe({
      next: (value: T) => {
        if (value !== lastValue) {
          lastValue = value;
          result$.emit(value);
        }
      },
      error: (err) => result$.error(err),
      complete: () => result$.complete(),
    }, true);
  });
  return result$;
};
