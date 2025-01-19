import { Subject } from '../observable.ts';
import type { Observable } from '../types.ts';

/**
 * Use the reducer function to compute an accumulated value that is emitted
 * along the way on every emission from the source observable.
 * @param reducer - the reducer function accepting the acc and the new value emitted by the source
 * @param base - the initial value of the reduction
 * @returns a new observable that emits reduced value on each source emitted value.
 */
export const reduce =
  <T, U>(reducer: (acc: U, value: T) => U, base: U) => (source$: Observable<T>) => {
    const result$ = new Subject<U>(() => {
      let acc = base;
      source$.subscribe({
        next: (val: T) => {
          acc = reducer(acc, val);
          result$.emit(acc);
        },
        complete: () => {
          result$.complete();
        },
        error: (e) => result$.error(e),
      });
    });
    return result$;
  };
