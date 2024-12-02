// import { type AnySubscriber, Observable } from "../index.ts";

// type Fn = () => void;

// let subscribing = false;
// let signals: Signal<any>[] = [];

// export class Signal<T> extends Observable<T> {
//   constructor(val: T) {
//     super(val);
//   }

//   get value(): T | undefined {
//     if (subscribing && signals.find((s) => s === this) === undefined) {
//       signals.push(this);
//     }
//     return super.lastValue;
//   }

//   set value(v: T) {
//     super.emit(v);
//   }
// }

// export const signal = <T>(initVal: T) => {
//   return new Signal<T>(initVal);
// };

// /**
//  * An effect is a function that will be executed when the signal changes
//  * Note: the function is curried.
//  * @param fn - a function to be executed
//  * @param s - a signal to monitor
//  */
// export const effect = (fn: () => void) => {
//   subscribing = true;
//   fn(); // This call will collect the signals the function is calling
//   signals.forEach((s) => s.subscribe(fn));
//   signals = [];
// };

