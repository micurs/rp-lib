import type { Observable } from "../index.ts";
import { Subject } from "../index.ts";

/**
 * A flatMap (also called mergeMap) operator applies a transformation function producing observables
 * to each value emitted by the source observable, and flattens the result into a
 * single observable that emits the values of mapped observables.
 * @param mapFn - the transformation function to apply to each value
 * @param source$ - the source observable
 * @returns a new observable that emits the flattened values
 */
export const flatMap = <I, O>(mapFn: (value: I) => Observable<O>) => {
  return (source$: Observable<I>) => {
    const result$ = new Subject<O>();
    result$.onSubscribe(() => {
      source$.subscribe({
        next: (value: I) => {
          const innerObservable$ = mapFn(value);
          innerObservable$.subscribe({
            next: (value) => {
              result$.emit(value);
            },
            error: (err) => result$.error(err),
            complete: () => {
              if (source$.isCompleted) {
                result$.complete();
              }
            },
          });
        },
        error: (err) => result$.error(err),
      });
    });
    return result$;
  };
};
