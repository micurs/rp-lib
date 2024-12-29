import type { Observable, Operator } from '../index.ts';
import { Subject } from '../index.ts';

/**
 * The throttle operator creates a new observable that only emits
 * a value from the source observable if they are received a given time apart.
 * If a value is received before the time has passed, it is ignored.
 * @param time - the time the values should be apart
 * @returns the new observable that emits the values with the given time apart
 */
export const throttle = <T>(time: number): Operator<T, T> => {
  return <T>(source$: Observable<T>): Observable<T> => {
    const result$ = new Subject<T>();
    let lastEmissionTime: number | undefined = undefined;
    source$.subscribe({
      next: (val: T) => {
        if (lastEmissionTime === undefined) {
          result$.emit(val);
          lastEmissionTime = Date.now();
          return;
        }
        const deltaTime = Date.now() - lastEmissionTime;
        if (deltaTime >= time) {
          result$.emit(val);
          lastEmissionTime = Date.now();
        }
      },
      error: (err: Error) => result$.error(err),
      complete: () => result$.complete(),
    });
    return result$;
  };
};
