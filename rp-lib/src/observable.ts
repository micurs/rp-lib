import type {
  FullSubscriber,
  Observable,
  Subscriber,
  Subscription,
} from "./types.ts";

type OnSubscribe = () => void;

const isOnSubscribe = (value: unknown): value is OnSubscribe =>
  typeof value === "function";

/**
 * A generic multi-cast observable class
 */
export class Subject<T> implements Observable<T> {
  private _subscribers: FullSubscriber<T>[] = [];
  private _lastValue: T | undefined;
  private _currentError: Error | undefined = undefined;
  private _isCompleted: boolean = false;
  private _emitter: (() => void) | null = null;

  /**
   * Create a new observable
   * @param emit -  the value to emit or the onSubscribe function to be execute on first subscription
   */
  constructor(emit?: T | (() => void)) {
    if (isOnSubscribe(emit)) {
      this._emitter = emit;
    } else {
      this._lastValue = emit;
    }
  }

  /**
   * Subscribe to the observable
   * @param subscriber - the subscriber function or object
   * @returns a subscription object
   */
  subscribe(subscriber: Subscriber<T>): Subscription {
    if (this._isCompleted) {
      return { unsubscribe: () => {} };
    }
    const newSubscriber: FullSubscriber<T> = (typeof subscriber === "function")
      ? { next: subscriber }
      : subscriber;

    // Create the unsubscribe function to return
    const unsubscribe = () => {
      this._subscribers = this._subscribers.filter((sub) =>
        sub !== newSubscriber
      );
    };

    // Make sure we are not subscribing more than once with the same subscriber
    if (
      this._subscribers.find((sub) =>
        sub === newSubscriber || sub.next === subscriber
      )
    ) {
      return { unsubscribe };
    }

    // Add the new subscriber to the list
    this._subscribers.push(newSubscriber);

    // If there is a pending value emits this value to the new subscriber
    if (this._lastValue !== undefined) {
      newSubscriber.next(this._lastValue);
    }

    // If there is a pending error emits this error to the new subscriber
    if (this._currentError && newSubscriber.error) {
      newSubscriber.error(this._currentError);
    }

    // If we have a onSubscribe function, call it
    if (this._emitter) {
      this._emitter();
      this._emitter = null;
    }

    return { unsubscribe };
  }

  onSubscribe(emitter: () => void) {
    this._emitter = emitter;
  }

  emit(value: T) {
    this._lastValue = value;
    this._subscribers
      .forEach((subscriber) => subscriber.next(value));
  }

  complete() {
    this._subscribers
      .forEach((subscriber) => subscriber.complete?.());
    this._subscribers = [];
    this._isCompleted = true;
  }

  error(e: Error) {
    this._currentError = e;
    this._subscribers.reduceRight(
      (_: void, observer) => observer.error?.(e),
      undefined,
    );
  }

  get lastValue(): T | undefined {
    return this._lastValue;
  }

  get isCompleted() {
    return this._isCompleted;
  }
}
