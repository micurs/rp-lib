import type { Observable, Operator } from '../index.ts';
import { Subject } from '../index.ts';

/**
 * A flatMap (also called mergeMap) operator applies a transformation function producing observables
 * to each value emitted by the source observable, and flattens the result into a
 * single observable that emits the values of mapped observables.
 * @param mapFn - the transformation function to apply to each value
 * @param source$ - the source observable
 * @returns a new observable that emits the flattened values
 */
export const flatMap = <I, O>(mapFn: (value: I) => Observable<O>): Operator<I, O> => {
  return (source$: Observable<I>): Observable<O> => {
    const result$ = new Subject<O>((out$) => {
      source$.subscribe({
        next: (value: I) => {
          // Create a new inner observable for each value from the source observable
          const innerObservable$ = mapFn(value);

          // Subscribe to the inner observable and emit its values to the result observable
          // note: the previous inner observable is still active and will continue to emit values
          innerObservable$.subscribe({
            next: (value) => out$.emit(value),
            error: (err) => out$.error(err),
            complete: () => source$.isCompleted && out$.complete(),
          });
        },
        error: (err) => out$.error(err),
      });
    });
    return result$;
  };
};
