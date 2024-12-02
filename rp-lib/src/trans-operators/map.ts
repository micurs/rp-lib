import type { Observable } from "../index.ts";
import { Subject } from "../index.ts";

/**
 * A map operator that applies a transformation function to each value emitted by the source observable.
 * @param transform - the transformation function to apply to each value
 * @param source - the source observable
 * @returns a new observable that emits the transformed values
 */
export const map =
  <T, U>(transform: (value: T) => U) => (source: Observable<T>) => {
    const result$ = new Subject<U>();
    result$.onSubscribe(() => {
      source.subscribe({
        next: (value) => result$.emit(transform(value)),
        error: (err) => result$.error(err),
        complete: () => result$.complete(),
      });
    });
    return result$;
  };
