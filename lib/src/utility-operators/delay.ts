import type { Observable } from '../types.ts';
import { Subject } from '../index.ts';

/**
 * Delays the emission of items from the source Observable by a given timeout.
 * @param due - The delay duration in milliseconds (a number)
 * @returns
 */
export const delay = <T>(due: number) => (source$: Observable<T>): Observable<T> => {
  const result$ = new Subject<T>(() => {
    source$.subscribe({
      next: (v) =>
        setTimeout(() => {
          result$.emit(v);
        }, due),
      error: (e) => setTimeout(() => result$.error(e), due),
      complete: () => setTimeout(() => result$.complete(), due),
    });
  });
  return result$;
};
