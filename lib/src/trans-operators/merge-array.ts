import { Subject } from '../index.ts';
import type { Observable, ObservableValues } from '../types.ts';

/**
 * Merge an array of multiple observables into a single observable.
 * The result observable will have the va
 * @param sources$ - the array of observables to merge
 * @param setLastValue - if true use the last observable to set the value of the new merged observable.
 * @returns an observable that emits the values of all the observables
 */
export const mergeArray = <
  Obs extends ReadonlyArray<Observable<unknown>>,
>(
  sources$: Obs,
  valueIdx: number = -1,
): Observable<ObservableValues<Obs>> => {
  const _values = sources$.map((o$) => o$.value);
  const out$ = new Subject<ObservableValues<Obs>>(() => {
    sources$.forEach((obs$, idx) =>
      obs$.subscribe({
        next: (v) => out$.emit(v as ObservableValues<Obs>),
        error: (e) => out$.error(e),
        complete: () => sources$.every((c) => c.isCompleted) && out$.complete(),
      }, valueIdx === idx) // Only emit the value of the valueIdx source
    );
  });
  return out$ as Observable<ObservableValues<Obs>>;
};
