import { useEffect, useRef, useState } from 'react';
import { Subject } from '@micurs/rp-lib';
import type { Observable, Operator } from '@micurs/rp-lib';

/**
 * A simple hook that subscribes to an observable and returns its current value.
 * The hook will re-set the value whenever the observable emits a new value.
 * @param initialValue The initial value to use until the observable emits a value.
 * @returns The current value of the observable.
 */
export const useObservable = <T>(
  obs$: Observable<T>,
): T | undefined => {
  const [, setState] = useState({}); // A dummy used to trigger a re-render
  useEffect(() => {
    obs$.subscribe(() => setState({}));
  }, [obs$]);
  return obs$.value;
};

/**
 * A hook that creates a source observable and an output observable using the given operator.
 * The hook returns the current value of the source and the output observables and a function
 * to submit values to the source observable.
 * Every time the source observable or the output observable emits a new value, the hook will
 * force a re-render of the component.
 * @param v - the initial value for the source observable
 * @param operator - the operator used to create the output observable
 * @returns a triplet with the value of the source, the value of the output
 * and a function to submit values to the source
 */
export const useObservables = <A, B>(
  v: A,
  operator: Operator<A, B>,
): [A | undefined, B | undefined, (v: A) => void] => {
  const source$ = useRef(new Subject(v));
  const out$ = useRef(operator(source$.current));
  return [
    useObservable(source$.current),
    useObservable(out$.current),
    (v: A) => source$.current.emit(v),
  ];
};
