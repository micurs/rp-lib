import { useEffect, useState } from 'react';
import type { Observable } from '@micurs/rp-lib';

/**
 * A simple hook that subscribes to an observable and returns its current value.
 * The hook will re-set the value whenever the observable emits a new value.
 * @param initialValue The initial value to use until the observable emits a value.
 * @returns The current value of the observable.
 */
export const useObservable = <T>(
  obs$: Observable<T>,
): T | undefined => {
  const [value, setState] = useState(() => obs$.value); // A dummy used to trigger a re-render
  useEffect(() => {
    const subscription = obs$.subscribe(() => setState(() => obs$.value), true);
    return () => {
      subscription.unsubscribe(); // Cleanup subscription
    };
  }, [obs$]);
  return value;
};
