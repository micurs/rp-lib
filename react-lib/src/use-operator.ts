import { useCallback, useMemo } from 'react';
import type { Observable, Operator } from '@micurs/rp-lib';
import { Subject } from '@micurs/rp-lib';

import { useObservable } from './index.ts';

/**
 * A hook that creates a source observable and an output observable using the given operator.
 * The hook returns the current value of the source and the output observables and a function
 * to submit values to the source observable.
 * Every time the source observable or the output observable emits a new value, the hook will
 * force a re-render of the component.
 * > **Note:** This hook will always cause an initial rerender after the first pass since it
 * applies the operator to the source that cause the output value to change from an initial
 * `undefined` to the calculated value.
 * @param val - the initial value for the source observable
 * @param operator - the operator used to create the output observable
 * @returns a triplet with the value of the source, the value of the output
 * and a function to submit values to the source
 */
export const useOperator = <A, B>(
  val: A,
  operator: Operator<A, B>,
): [A | undefined, B | undefined, (v: A) => void] => {
  const source$ = useMemo<Observable<A> | null>(() => new Subject(val), [val]);
  const out$ = useMemo<Observable<B> | null>(() => {
    return operator(source$);
  }, [val, operator]);
  const setter = useCallback((newVal: A) => {
    source$ && source$.emit(newVal);
  }, [source$]);
  const outValue = useObservable<B>(out$);
  console.log('Returning values', outValue);
  return [
    source$.value,
    outValue,
    setter,
  ];
};