import { l } from 'vite';
import type { Observable, Operator } from '../index.ts';
import { Subject } from '../index.ts';
import { s } from 'vite';

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
    let lastSourceValue: T | undefined = undefined;
    let lastEmissionTime: number | undefined = undefined;
    let _timeout: ReturnType<typeof setTimeout> | undefined = undefined;
    source$.subscribe({
      next: (val: T) => {
        if (_timeout !== undefined) {
          clearTimeout(_timeout);
          _timeout = undefined;
        }
        if (lastEmissionTime === undefined) {
          result$.emit(val);
          lastEmissionTime = Date.now();
          return;
        }
        const deltaTime = Date.now() - lastEmissionTime;
        if (deltaTime >= time) {
          result$.emit(val);
          lastEmissionTime = Date.now();
          lastSourceValue = undefined;
        } else {
          lastSourceValue = val;
          if (lastSourceValue === undefined) {
            return;
          }
          _timeout = setTimeout(() => {
            if (result$.isCompleted) {
              return;
            }
            lastSourceValue !== undefined && result$.emit(lastSourceValue);
            lastEmissionTime = Date.now();
            lastSourceValue = undefined;
            if (source$.isCompleted) {
              result$.complete();
            }
          }, time - deltaTime);
        }
      },
      error: (err: Error) => result$.error(err),
      complete: () => {
        lastSourceValue === undefined && result$.complete();
      },
    });
    return result$;
  };
};
