import type { Observable, Operator } from "../types.ts";
import { Subject } from "../index.ts";

/**
 * A transformer operator that applies a side effect to each value emitted by the source observable.
 * @param sideEffect - the function to apply to each value emitted by the source observable.
 * @param source$ - the source observable.
 * @returns a new observable that emits the same values as the source observable, but with the side effect applied.
 */
export const tap =
  <T>(sideEffect: (value: T) => void): Operator<T, T> => (source$: Observable<T>): Observable<T> => {
    const result$ = new Subject<T>();
    result$.onSubscribe(() => {
      source$.subscribe({
        next: (value) => {
          sideEffect(value);
          result$.emit(value);
        },
        error: (error) => result$.error(error),
        complete: () => result$.complete(),
      });
    });
    return result$;
  };
