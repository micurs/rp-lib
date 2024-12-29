import type { Observable, Operator, Subscription } from '../index.ts';
import { concat, Subject } from '../index.ts';

/**
 * Maps each emitted value to an observable and concatenates the results
 * in a serialized fashion waiting for each one to complete before merging the next.
 * @param mapFn - a function that maps each emitted value to an observable
 * @param source$ - the source observable
 * @returns a new observable that emits the values from the projected observables
 */
export const concatMap =
  <I, O>(mapFn: (value: I) => Observable<O>): Operator<I, O> =>
  (source$: Observable<I>): Observable<O> => {
    const result$ = new Subject<O>();
    // the inner accumulator is the observable that will be concatenated
    let innerAccumulator$: Observable<O> | undefined = undefined;
    // the previous subscription to the inner accumulator (we use it to unsubscribe)
    let prevSubscription: Subscription | undefined;
    source$.subscribe({
      next: (value: I) => {
        // unsubscribe from the previous inner accumulator
        if (prevSubscription) {
          prevSubscription.unsubscribe();
        }
        // map the current value to an observable
        const mapped$ = mapFn(value);

        // concatenate the new observable to the inner accumulator
        innerAccumulator$ = innerAccumulator$ ? concat<O, O>(mapped$)(innerAccumulator$) : mapped$;

        // subscribe to the inner accumulator
        prevSubscription = innerAccumulator$.subscribe({
          next: (value: O) => result$.emit(value),
          error: (err: Error) => result$.error(err),
          complete: () => {
            source$.isCompleted && result$.complete();
          },
        });
      },
      error: (err: Error) => result$.error(err),
      complete: () => {
        if (innerAccumulator$ && innerAccumulator$.isCompleted) {
          result$.complete();
        }
      },
    });
    return result$;
  };
