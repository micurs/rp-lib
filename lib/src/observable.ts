/**
 * A simple implementation of an Observable Subject class
 * @module subject
 */

import type { FullSubscriber, Observable, Subscriber, Subscription } from './types.ts';

/**
 * The type of the function that is executed on first subscription
 */
type OnSubscribe = () => void;

/**
 * Check if a value is an OnSubscribe function
 * @internal
 * @param value - the value to check
 * @returns true if the value is an OnSubscribe function, false otherwise
 */
const isOnSubscribe = (value: unknown): value is OnSubscribe => typeof value === 'function';

/**
 * A generic multi-cast observable class.
 * Allows multiple subscribers and to register an emitter function to be executed on first subscription.
 */
export class Subject<T> implements Observable<T> {
  /**@internal */
  private _subscribers: Array<FullSubscriber<T>> = [];
  /**@internal */
  private _lastValue: T | undefined = undefined;
  /**@internal */
  private _currentError: Error | undefined = undefined;
  /**@internal */
  private _isCompleted: boolean = false;
  /**@internal */
  private _emitter: (() => void) | null = null;

  /**
   * Create a new observable
   * @param emit -  the value to emit or the onSubscribe function to be executed on first subscription
   */
  constructor(valueOrEmitter: T | undefined | (() => void) = undefined) {
    if (isOnSubscribe(valueOrEmitter)) {
      this._emitter = valueOrEmitter;
      return;
    }
    this._lastValue = valueOrEmitter;
  }

  /**
   * Subscribe to the observable
   * @param subscriber - the subscriber function or object
   * @returns a subscription object
   */
  subscribe(subscriber: Subscriber<T>, run: boolean = true): Subscription {
    if (this._isCompleted) {
      return { unsubscribe: () => {} };
    }
    const newSubscriber: FullSubscriber<T> = (typeof subscriber === 'function')
      ? { next: subscriber }
      : subscriber;

    // Create the unsubscribe function to return
    const unsubscribe = (clear = true) => {
      this._subscribers = this._subscribers.filter((sub) => sub !== newSubscriber);

      // If there are no more subscribers, reset the last value
      // we avoid the last value being emitted to a new subscriber
      if (clear && this._subscribers.length === 0) {
        this._lastValue = undefined;
      }
    };

    // Make sure we are not subscribing more than once with the same subscriber
    if (this._subscribers.find((sub) => sub === newSubscriber || sub.next === subscriber)) {
      return { unsubscribe };
    }

    // Add the new subscriber to the list
    this._subscribers.push(newSubscriber);

    // If there is a pending value emits this value to the new subscriber
    if (this._lastValue !== undefined && run) {
      newSubscriber.next?.(this._lastValue);
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

  /**
   * Set the onSubscribe function to be executed on first subscription
   * @param emitter - the function to be executed on first subscription
   */
  onSubscribe(emitter: () => void) {
    this._emitter = emitter;
  }

  /**
   * Emit a value to all subscribers
   * @param value - the value to emit
   */
  emit(value: T) {
    if (this._isCompleted) {
      return;
    }
    this._lastValue = value;
    this._subscribers
      .forEach((subscriber) => subscriber.next?.(value));
  }

  /**
   * Complete the Observable
   */
  complete() {
    this._subscribers
      .forEach((subscriber) => subscriber.complete?.());
    this._subscribers = [];
    this._isCompleted = true;
  }

  /**
   * Emit an error to all subscribers
   * @param e - the error to emit
   */
  error(e: Error) {
    this._currentError = e;
    this._subscribers
      .reduceRight(
        (_: void, observer) => observer.error?.(e),
        undefined,
      );
  }

  /**
   * Get the last value emitted by the Observable
   * @returns the last value emitted by the Observable
   */
  get value(): T | undefined {
    return this._lastValue;
  }

  /**
   * Get the completion status of the Observable
   * @returns the completion status of the Observable
   */
  get isCompleted(): boolean {
    return this._isCompleted;
  }
}
