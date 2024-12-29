/// <reference lib="deno.ns" />

import { assertSpyCallArg, assertSpyCalls, spy } from 'jsr:@std/testing/mock';
// import { EventEmitter } from 'node:events';
import {
  from,
  fromArray,
  fromAsyncGenerator,
  fromGenerator,
  fromPromise,
  fromTimer,
  range,
} from '../src/index.ts';
import { defer } from './utils.ts';

Deno.test('Operator fromArray creates an Observable emitting 2 values', () => {
  const obs$ = fromArray([1, 2]);
  const sub = spy();
  obs$.subscribe(sub);
  assertSpyCalls(sub, 2);
});

Deno.test('Operator from creates an Observable emitting 2 values', () => {
  const obs$ = from(1, 2, 3);
  const sub = spy();
  obs$.subscribe(sub);
  assertSpyCalls(sub, 3);
});

Deno.test('Operator fromArray creates an Observable emitting NO values', () => {
  const obs$ = fromArray([]);
  const sub = spy();
  obs$.subscribe(sub);
  assertSpyCalls(sub, 0);
});

Deno.test('Operator from creates an Observable emitting NO values', () => {
  const obs$ = from();
  const sub = spy();
  obs$.subscribe(sub);
  assertSpyCalls(sub, 0);
});

Deno.test('Operator fromTimer creates an Observable emitting 1 value right away and one after 10ms', async () => {
  const sub = spy();
  const complete = spy();
  const obs$ = fromTimer(5, [1, 2], 'onSubscribe');
  obs$.subscribe({
    next: sub,
    complete,
  });
  assertSpyCalls(sub, 1);
  await defer(20);
  assertSpyCalls(sub, 2);
  assertSpyCalls(complete, 1);
});

Deno.test('Operator fromTimer creates an Observable emitting 2 value after 10ms - after subscribing', async () => {
  const sub = spy();
  const obs$ = fromTimer(10, [1, 2], 'onSubscribe');
  obs$.subscribe(sub);
  await defer(100);
  assertSpyCalls(sub, 2);
});

Deno.test('Operator fromTimer creates an Observable emitting 2 value after 10ms - immediately', async () => {
  const sub = spy();
  const obs$ = fromTimer(10, [1, 2], 'now');
  await defer(50);
  obs$.subscribe(sub);
  assertSpyCalls(sub, 0); // no values captured by the subscribers because they were emitted before
});

Deno.test('Operator fromPromise emits when the source promise resolve', async () => {
  const sub = {
    next: spy(),
    complete: spy(),
  };
  const obs$ = fromPromise(Promise.resolve(100));
  obs$.subscribe(sub);
  await defer();
  assertSpyCalls(sub.next, 1);
  assertSpyCalls(sub.complete, 1);
});

Deno.test('Operator fromPromise that reject will emit error', async () => {
  const sub = {
    next: spy(),
    error: spy(),
  };
  const obs$ = fromPromise(Promise.reject(new Error('Test Error')));
  obs$.subscribe(sub);
  await defer();
  assertSpyCalls(sub.next, 0);
  assertSpyCalls(sub.error, 1);
});

Deno.test('Operator fromGenerator creates an Observable emitting 2 values', () => {
  const generator = function* () {
    yield 1;
    yield 2;
  };
  const obs$ = fromGenerator(generator(), 'onSubscribe');
  const sub = spy();
  obs$.subscribe(sub);
  assertSpyCalls(sub, 2);
});

Deno.test('Operator fromAsyncGenerator creates an Observable emitting 2 values', async () => {
  const generator = async function* () {
    yield defer(5).then(() => 1);
    yield defer(5).then(() => 2);
  };
  const obs$ = fromAsyncGenerator(generator());
  const sub = spy();
  obs$.subscribe(sub);
  await defer(20);
  assertSpyCalls(sub, 2);
});

Deno.test('Operator range creates an Observable emitting a sequence of numbers', () => {
  const obs$ = range(1, 3);
  const sub = spy();
  obs$.subscribe(sub);
  assertSpyCalls(sub, 3);
  assertSpyCallArg(sub, 0, 0, 1);
  assertSpyCallArg(sub, 1, 0, 2);
  assertSpyCallArg(sub, 2, 0, 3);
});

// Deno.test("Operator fromEvent creates an Observable emitting events", () => {
//   const emitter = new EventEmitter();
//   const obs$ = fromEvent(emitter, "click");
//   const sub = spy((v: Event) => {
//     console.log("sub", v);
//   });
//   obs$.subscribe(sub);
//   emitter.emit("click", "a test event");
//   assertSpyCalls(sub, 1);
//   assertSpyCallArg(sub, 0, 0, "a test event");
// });
