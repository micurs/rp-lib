import { useEffect, useState } from 'react';
import type { Signal } from '@micurs/rp-lib';

/**
 * Simple custom hook that can be used to integrate react with rp-lib Signal class.
 * @param signal - The signal to subscribe to.
 * @param def - The default value to return if the signal has not yet emitted a value.
 * @returns a value as emitted by the signal or the default value if the signal has not yet emitted a value.
 */
export function useSignal<M>(signal: Signal<M>, def: NonNullable<M>): M {
  const [, setState] = useState({});
  useEffect(() => {
    const clearEffect = signal.addEffect(() => setState({}));
    return () => clearEffect();
  }, [signal]);
  return signal.value ?? def;
}
