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
    let lastNotEmittedValue: T | undefined = undefined;
    let lastEmissionTime: number | undefined = undefined;
    let _timeout: ReturnType<typeof setTimeout> | undefined = undefined;

    const throttleEmit = (val: T) => {
      result$.emit(val);
      lastEmissionTime = Date.now();
      lastNotEmittedValue = undefined;
    };

    source$.subscribe({
      next: (val: T) => {
        if (_timeout !== undefined) {
          clearTimeout(_timeout);
          _timeout = undefined;
        }
        if (lastEmissionTime === undefined) {
          throttleEmit(val);
          return;
        }
        const deltaTime = Date.now() - lastEmissionTime;
        if (deltaTime >= time) {
          throttleEmit(val);
        } else {
          lastNotEmittedValue = val;
          _timeout = setTimeout(() => {
            _timeout = undefined;
            if (result$.isCompleted) {
              return;
            }
            throttleEmit(val);
            if (source$.isCompleted) {
              result$.complete();
            }
          }, time - deltaTime);
        }
      },
      error: (err: Error) => result$.error(err),
      complete: () => {
        lastNotEmittedValue === undefined && result$.complete();
      },
    });
    return result$;
  };
};
