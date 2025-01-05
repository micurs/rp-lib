import { Subject } from '../index.ts';
import type { Observable, ObservableValues } from '../types.ts';

/**
 * Merge an array of multiple observables into a single observable.
 * @param sources$ - the array of observables to merge
 * @returns an observable that emits the values of all the observables
 */
export const mergeArray = <
  Obs extends ReadonlyArray<Observable<unknown>>,
>(
  sources$: Obs,
): Observable<ObservableValues<Obs>> => {
  const _values = sources$.map((o$) => o$.value);
  const out$ = new Subject<ObservableValues<Obs>>();
  sources$.forEach((obs$) =>
    obs$.subscribe({
      next: (v) => out$.emit(v as ObservableValues<Obs>),
      error: (e) => out$.error(e),
      complete: () => sources$.every((c) => c.isCompleted) && out$.complete(),
    })
  );
  return out$ as Observable<ObservableValues<Obs>>;
};
