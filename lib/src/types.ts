/**
 * A FullSubscriber listen to values emitted by an Observable and
 * to its error and complete events.
 */
export interface FullSubscriber<T> {
  next: (value: T) => void;
  error?: (error: Error) => void;
  complete?: () => void;
}

/**
 * A SubscriberFn is a function that listens to values emitted by an Observable.
 */
export type SubscriberFn<T> = (value: T) => void;

/**
 * A Subscriber is either a FullSubscriber or a function SubscriberFn.
 */
export type Subscriber<A> = SubscriberFn<A> | FullSubscriber<A>;

/**
 * An Observable is an object that emits values and dispatch these
 * values to a list of Subscribers.
 */
export interface Observable<T> {
  subscribe(subscriber: Subscriber<T>, run?: boolean): Subscription;
  emit(value: T): void;
  complete(): void;
  error(error: Error): void;
  value: T | undefined;
  isCompleted: boolean;
}

/**
 * A Subscription object represents a function association with a
 * specific Observable. It exposes a `unsubscribe()` function to
 * sever that association.
 */
export interface Subscription {
  unsubscribe: () => void;
}

/**
 * An Operator is a function that transform an Observable into a new one.
 */
export type Operator<A, B> = (observable: Observable<A>) => Observable<B>;

/**
 * An Effect is a function that is executed when an Observable is subscribed to.
 */
export type Effect = () => void;