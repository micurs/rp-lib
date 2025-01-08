import type { Observable, Operator } from '../index.ts';
import { Subject } from '../index.ts';

/**
 * A switchMap operator that applies a transformation function producing observables
 * to each value emitted by the source observable, and switches to the latest inner
 * observable, emitting values from it.
 * @param mapFn - the transformation function to apply to each value
 * @param source$ - the source observable
 * @returns a new observable that emits the values of the latest inner observable
 */
export const switchMap = <I, O>(mapFn: (value: I) => Observable<O>): Operator<I, O> => {
  return (source$: Observable<I>) => {
    let innerObservable$: Observable<O> | null = null;
    const result$ = new Subject<O>((out$) => {
      source$.subscribe({
        next: (value: I) => {
          // Cancel the previous inner observable when a new value from the source observable is emitted
          innerObservable$ && innerObservable$.complete();
          innerObservable$ = mapFn(value);

          // Subscribe to the inner observable and emit its values to the result observable
          // Note: the previous inner observable has been cancelled. No new values will be emitted from it.
          innerObservable$.subscribe({
            next: (value) => out$.emit(value),
            error: (err: Error) => out$.error(err),
            complete: () => source$.isCompleted && out$.complete(),
          });
        },
        error: (err: Error) => out$.error(err),
        complete: () => {
          innerObservable$ !== null && innerObservable$.isCompleted && out$.complete();
        },
      });
    });
    return result$;
  };
};
