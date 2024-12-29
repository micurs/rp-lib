// <reference lib="deno.ns" />

import type { Observable, Operator } from '../index.ts';
import { Subject } from '../index.ts';

type Timer = ReturnType<typeof setInterval>;

/**
 * The debounce operator creates a new observable that only emits
 * a value from the source observable after a given time has passed.
 * @param time - the amount of time to wait before emitting the last value
 * @returns the new observable that emits the last value after the given time
 */
export const debounce = <T>(time: number): Operator<T, T> => {
  return <T>(source$: Observable<T>): Observable<T> => {
    const result$ = new Subject<T>();
    let timeout: Timer | undefined = undefined;
    const buffer: T[] = [];
    let toComplete = false;
    source$.subscribe({
      next: (val: T) => {
        if (timeout) {
          // We don't emit until the timeout is cleared. So we buffer the values.
          buffer.push(val);
          return;
        }
        result$.emit(val);
        timeout = setInterval(() => {
          const nextVal = buffer.shift();
          if (nextVal) {
            result$.emit(nextVal);
          } else {
            console.log('clear timeout. No more values to emit');
            clearInterval(timeout);
            timeout = undefined;
            if (toComplete) {
              console.log('Completing');
              result$.complete();
            }
          }
        }, time);
      },
      error: (err: Error) => result$.error(err),
      complete: () => {
        if (timeout) {
          console.log('postponing complete', buffer.length, 'values to emit');
          toComplete = true;
          return;
        }
        if (buffer.length === 0) {
          console.log('Completing');
          result$.complete();
        }
      },
    });
    return result$;
  };
};
