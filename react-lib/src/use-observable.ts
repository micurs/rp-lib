import { useEffect, useState } from "react";
import type { Observable } from "jsr:@micurs/rp-lib";

/**
 * A simple hook that subscribes to an observable and returns its current value.
 * The hook will re-set the value whenever the observable emits a new value.
 * @param observable The observable to subscribe to.
 * @param initialValue The initial value to use until the observable emits a value.
 * @returns The current value of the observable.
 */
export const useObservable = <T>(
  observable: Observable<T>,
  initialValue: T,
): T => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    const subscription = observable.subscribe(setValue);
    return () => subscription.unsubscribe();
  }, [observable]);
  return value;
};
