import type { Observable } from "../index.ts";
import { Subject } from "../index.ts";

/**
 * A switchMap operator that applies a transformation function producing observables
 * to each value emitted by the source observable, and switches to the latest inner
 * observable, emitting values from it.
 * @param mapFn - the transformation function to apply to each value
 * @param source$ - the source observable
 * @returns a new observable that emits the values of the latest inner observable
 */
export const switchMap = <I, O>(mapFn: (value: I) => Observable<O>) => {
  return (source$: Observable<I>) => {
    const result$ = new Subject<O>();
    let innerObservable$: Observable<O> | null = null;
    result$.onSubscribe(() => {
      source$.subscribe({
        next: (value: I) => {
          innerObservable$ && innerObservable$.complete();
          innerObservable$ = mapFn(value);
          innerObservable$.subscribe({
            next: (value) => result$.emit(value),
            error: (err: Error) => result$.error(err),
            complete: () => source$.isCompleted && result$.complete(),
          });
        },
        error: (err: Error) => result$.error(err),
        complete: () => innerObservable$ === null && result$.complete(),
      });
    });
    return result$;
  };
};
