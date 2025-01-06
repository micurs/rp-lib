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
  const [_, setState] = useState(() => obs$.value); // A dummy state used to trigger a re-render
  useEffect(() => {
    // Subscribe, but don't set the state on current value to avoid a re-rendering.
    const subscription = obs$.subscribe(setState, false);

    return () => {
      subscription.unsubscribe(); // Cleanup subscription
    };
  }, [obs$]);
  return obs$.value;
};
