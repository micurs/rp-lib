import { Subject } from "../index.ts";
import type { Observable } from "../types.ts";

/**
 * A transformer operator that applies a side effect to each value emitted by the source observable.
 * @param sideEffect - the function to apply to each value emitted by the source observable.
 * @param source$ - the source observable.
 * @returns a new observable that emits the same values as the source observable, but with the side effect applied.
 */
export const tap =
  <T>(sideEffect: (value: T) => void) => (source$: Observable<T>) => {
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
