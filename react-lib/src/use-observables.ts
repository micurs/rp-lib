import { useEffect, useState } from 'react';
import type { Observable, ObservableValues } from '../../lib/src/types.ts';
import { mergeArray } from '../../lib/src/index.ts';

// type P = [Observable<number>, Observable<string>, string];
// type P2 = ObservableValues<P>; // [number, string]

/**
 * A hook that subscribes to an array of observables and returns their current values.
 * If any of the observables emits a new value, the hook will force a re-render of the component.
 * @param observables - an array of observables
 * @returns an array with the current values of the observables
 */
export const useObservables = <
  Obs extends [Observable<unknown>, ...ReadonlyArray<Observable<unknown>>],
>(
  observables: Obs,
): ObservableValues<Obs> => {
  const [values, setState] = useState(observables.map((o) => o.value));
  useEffect(() => {
    const subscription = mergeArray(observables).subscribe((_) => {
      setState(observables.map((o) => o.value));
    }, false);
    return () => {
      subscription.unsubscribe(); // Cleanup subscription
    };
  }, [observables]);
  return values as ObservableValues<Obs>;
};
