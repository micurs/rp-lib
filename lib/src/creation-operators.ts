import type { Observable } from './index.ts';
import { Subject } from './index.ts';
// import { EventEmitter } from "node:events";

/**
 * Creates a Observable that will emit a sequence of values from the given array.
 * Note: the values are emitted synchronously, once the observable is subscribed to.
 * @param values - an array of value to stream through the created observable
 * @returns an Observable
 */
export const fromArray = <T>(values: T[]): Observable<T> => {
  const arrayObs$ = new Subject<T>(() => {
    values.forEach((v) => arrayObs$.emit(v));
    arrayObs$.complete();
  });
  return arrayObs$;
};

/**
 * Creates a Observable that synchronously emits a sequence of values from the given parameters.
 * Note: the values are emitted synchronously, once the observable is subscribed to.
 * @param values - a list of parameters to stream through the created observable
 * @returns an Observable
 */
export const from = <T>(...values: T[]): Observable<T> => {
  const fromObservable$ = new Subject<T>(() => {
    values.forEach((val) => fromObservable$.emit(val));
    fromObservable$.complete();
  });
  return fromObservable$;
};

/**
 * Creates an Observable that will emit a sequence of numbers from a start number to a given count.
 * @param start - the start number
 * @param count - the number of values to emit
 * @returns an Observable emitting a sequence of numbers
 */
export const range = (start: number, count: number): Observable<number> => {
  const range$ = new Subject<number>(() => {
    for (let i = start; i < start + count; i++) {
      range$.emit(i);
    }
    range$.complete();
  });
  return range$;
};

/**
 * Creates an Observable that will emit events from a given event target.
 * @param target - the event target, that is any object with an addEventListener method.
 * @param eventName - the event name
 * @returns an Observable emitting events
 */
// export const fromEvent = (
//   target: EventTarget | EventEmitter,
//   eventName: string,
// ): Observable<Event> => {
//   const eventObs$ = new Subject<Event>();
//   if (target instanceof EventEmitter) {
//     target.on(eventName, (event) => eventObs$.emit(event));
//   } else {
//     target.addEventListener(eventName, (event) => eventObs$.emit(event));
//   }
//   return eventObs$;
// };

/**
 * Creates an Observable that will emit with a given delay a set of values.
 * @param delayMs - an interval in millisecond used to emit values.
 * @param values - the array of values to emit through the created Observable
 * @returns an Observable
 */
export const fromTimer = <T>(
  delayMs: number,
  values: T[],
  start: 'onSubscribe' | 'now' = 'onSubscribe',
): Observable<T> => {
  const arrayObs$ = new Subject<T>();
  let idx = 1;
  const emitter = () => {
    arrayObs$.emit(values[0]);
    const timer = setInterval(() => {
      if (idx < values.length) {
        arrayObs$.emit(values[idx]);
        idx++;
      } else {
        clearInterval(timer);
        arrayObs$.complete();
      }
    }, delayMs);
  };

  if (start === 'onSubscribe') {
    arrayObs$.onSubscribe(emitter);
  } else {
    emitter();
  }
  return arrayObs$;
};

/**
 * Creates an Observable that will emit a sequence of numbers with a given delay.
 * The sequence will start from 0 and will continue for a count number of values.
 * The emission of values will start on first subscription or immediately.
 * @param delayMs - an interval in millisecond used to emit values.
 * @param count - the max number of values to emit
 * @returns an Observable emitting a sequence of numbers
 */
export const interval = (
  delayMs: number,
  start: 'onSubscribe' | 'now' = 'onSubscribe',
  count = Infinity,
): Observable<number> => {
  const interval$ = new Subject<number>();
  const emitter = () => {
    let idx = 0;
    const timer = setInterval(() => {
      if (idx >= count) {
        clearInterval(timer);
        interval$.complete();
      } else {
        interval$.emit(idx);
        idx++;
      }
    }, delayMs);
  };

  if (start === 'onSubscribe') {
    interval$.onSubscribe(emitter);
  } else {
    emitter();
  }
  return interval$;
};

/**
 * Converts a Promise into an Observable
 * @param promise - the promise to convert into an Observable
 * @returns an Observable
 */
export const fromPromise = <T>(promise: Promise<T>): Subject<T> => {
  const promise$ = new Subject<T>(() =>
    promise
      .then((r) => promise$.emit(r))
      .catch((e) => promise$.error(e))
      .finally(() => promise$.complete())
  );
  return promise$;
};

/**
 * Converts a Generator into an Observable.
 * Note: the generator is iterated synchronously, once the observable is subscribed to.
 * @param generator - the generator to convert into an Observable
 * @returns an Observable
 */
export const fromGenerator = <T>(
  generator: Generator<T>,
  start: 'onSubscribe' | 'now' = 'onSubscribe',
): Observable<T> => {
  const generatorObs$ = new Subject<T>();
  const emitter = () => {
    for (const val of generator) {
      generatorObs$.emit(val);
    }
    generatorObs$.complete();
  };

  if (start === 'onSubscribe') {
    generatorObs$.onSubscribe(emitter);
  } else {
    emitter();
  }
  return generatorObs$;
};

/**
 * Converts a AsyncGenerator into an Observable.
 * Note: the async generator is iterated asynchronously, once the observable is subscribed to.
 * @param generator - the async generator to convert into an Observable
 * @returns an Observable
 */
export const fromAsyncGenerator = <T>(
  generator: AsyncGenerator<T>,
  start: 'onSubscribe' | 'now' = 'onSubscribe',
): Observable<T> => {
  const generatorObs$ = new Subject<T>();
  const emitter = async () => {
    for await (const val of generator) {
      generatorObs$.emit(val);
    }
    await generatorObs$.complete();
  };
  if (start === 'onSubscribe') {
    generatorObs$.onSubscribe(emitter);
  } else {
    void emitter();
  }
  return generatorObs$;
};
