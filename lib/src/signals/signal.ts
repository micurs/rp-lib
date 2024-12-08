import { Subject } from "@micurs/rp-lib";
import type { Observable, Effect } from "@micurs/rp-lib";

/**
 * A Signal instance represents the capability to read a dynamically
 * changing value whose updates are tracked over time.
 * It also implicitly includes the capability to subscribe to the Signal,
 * using the `Signal.effect()`.
 * We can also create derived Signals from other Signals using the
 * `Signal.computed()` method.
 */
export class Signal<T> {
  private _observable$: Observable<T>;
  private static _effects: Set<Effect> = new Set();
  private static _effectedObservables$: Set<Observable<unknown>> = new Set();

  constructor(value: T) {
    this._observable$ = new Subject(value);
  }

  /**
   * Emit a new value to the Signal
   * @param value - the value to emit
   */
  emit(value: T) {
    this._observable$.emit(value);
  }

  /**
   * Get the last value emitted by the Signal
   * @returns the last value emitted by the Signal
   */
  get value(): T | undefined {
    // If there are pending effects, subscribe to them and collect the
    // observables in a set
    Signal._effects.forEach(effect => {
      Signal._effectedObservables$.add(this._observable$);
      this._observable$.subscribe(effect, false);
    });

    return this._observable$.value;
  }

  /**
   * Add an effect to the signals read in the effect function itself.
   * Note: the effect function is static as part of the Signal class.
   * @param fn - the effect to add
   */
  static effect(fn: () => void) {
    Signal._effects.add(fn);
    fn();
    Signal._effects.delete(fn);
  }

  /**
   * Create a computed signal from a function that reads other signals
   * and compute a new value that will be emitted by the computed signal
   * every time the source signals change.
   * Note: the effect function is static as part of the Signal class.
   * @param fn - the function to create a computed signal from
   * @returns a computed signal
   */
  static computed<O>(fn: () => O): Signal<O> {
    Signal._effects.add(fn);
    const value = fn();
    const signals = [ ...Signal._effectedObservables$].reverse();
    Signal._effectedObservables$.clear();
    const result$ = new Signal<O>(value);
    signals.forEach(o$ => {
      o$.subscribe({
        next: (_) => {
          result$.emit(fn());
        },
      }, false);
    });
    return result$;
    }
}


