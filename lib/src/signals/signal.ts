import { Subject } from '../index.ts';
import type { Effect, Observable, Subscription } from '../index.ts';

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

  // Used to keep track of the observables that may trigger each effect
  private static _effectedObservables$: Map<Effect, Set<Observable<unknown>>> = new Map();

  // Used to keep track of the subscriptions for each active effect
  private static _subscriptions: Map<Effect, Array<Subscription>> = new Map();

  constructor(value: T) {
    this._observable$ = new Subject(value);
  }

  /**
   * Build a Signal from an observable
   * @param observable - the source observable to build the Signal from
   * @returns
   */
  static fromObservable<T>(
    observable: Observable<T>,
    onComplete?: () => void,
  ): Signal<T | undefined> {
    const signal = new Signal(observable.value);
    signal._observable$ = observable;
    signal._observable$.subscribe({
      complete: onComplete,
    });
    // observable.subscribe({
    //   next: (value) => signal.value = value,
    //   complete:
    // });
    return signal;
  }

  /**
   * Emit a new value to the Signal
   * @param value - the value to emit
   */
  emit(value: T) {
    this._observable$.emit(value);
  }

  set value(value: T) {
    this._observable$.emit(value);
  }

  /**
   * Get the last value emitted by the Signal.
   * Note: if this method is called inside an effect function,
   * it will make sure the internal observable is subscribed to current effect.
   * @returns the last value emitted by the Signal
   */
  get value(): T | undefined {
    // If there are pending effects, subscribe to them and collect the
    // observables in a set
    Signal._effects.forEach((effect) => {
      // Subscribe to the signal internal observable
      const subscription = this._observable$.subscribe(effect, false);

      // Add the observable associated to this signal as a source of the effect
      const sources = Signal._effectedObservables$.get(effect) ||
        new Set<Observable<unknown>>();
      Signal._effectedObservables$.set(effect, sources.add(this._observable$));

      // Add the subscription to the list of subscriptions for this effect
      const subs = [...(Signal._subscriptions.get(effect) || []), subscription];
      Signal._subscriptions.set(effect, subs);
    });
    return this._observable$.value;
  }

  /**
   * Add an effect to the signals read in the effect function itself.
   * Note: the effect function is static as part of the Signal class.
   * @param fn - the effect to add.
   * @returns a function to make the effect inactive.
   */
  static effect(fn: () => void): () => void {
    Signal._effects.add(fn);
    fn();
    Signal._effects.delete(fn);
    return () => {
      Signal._subscriptions.get(fn)?.forEach((sub) => sub.unsubscribe());
      Signal._subscriptions.delete(fn);
    };
  }

  /**
   * Add an explicit effect to the Signal.
   * @param effect - a simple function that will receive the value of the signal
   * @returns a function to remove the effect
   */
  addEffect(effect: (value: T) => void): () => void {
    const sub = this._observable$.subscribe(effect);
    return () => sub.unsubscribe(false); // Do not remove the last value.
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
    // Run the function to compute the initial value and collect the observables of all
    // the signals that are mentioned in the compute effect function.
    Signal._effects.add(fn);
    const value = fn();
    Signal._effects.delete(fn);

    // Retrieve the observables that may trigger the effect
    const sources = Signal._effectedObservables$.get(fn) ||
      new Set<Observable<unknown>>();

    // Create a new signal with the computed value
    const result$ = new Signal<O>(value);

    // Subscribe to the sources observable by running the computed function
    // every time any of the source changes
    sources.forEach((o$) => {
      o$.subscribe({
        next: (_) => {
          result$.emit(fn());
        },
      }, false);
    });

    return result$;
  }
}
