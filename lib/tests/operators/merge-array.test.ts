/// <reference lib="deno.ns" />

import { assertSpyCallArg, assertSpyCalls, spy } from 'jsr:@std/testing/mock';

import { mergeArray, Subject } from '../../src/index.ts';
import { expect } from 'jsr:@std/expect/expect';

Deno.test('mergeArray correctly emit when one of the merged observable emit', () => {
  const spyFn = spy();

  const obs1$ = new Subject(0);
  const obs2$ = new Subject('test');
  const obs3$ = new Subject({ test: 100 });
  // Create a new observable merging the 3 sources and with undefined value
  const merged$ = mergeArray([obs1$, obs2$, obs3$]);

  merged$.subscribe(spyFn);

  // We expect no call to the subscriber because the merged$.value is undefined.
  assertSpyCalls(spyFn, 0);

  obs2$.emit('new test');
  assertSpyCalls(spyFn, 1);
  assertSpyCallArg(spyFn, 0, 0, 'new test');
});

Deno.test('mergeArray correctly emit when one of the merged observable emit', () => {
  const spyFn = spy();

  const obs1$ = new Subject(0);
  const obs2$ = new Subject('test');
  const obs3$ = new Subject({ test: 100 });
  // Create a new observable merging the 3 sources and with value matching the last one.
  const merged$ = mergeArray([obs1$, obs2$, obs3$], 2);

  merged$.subscribe(spyFn);

  // We expect to get an observable with the last source observable value.
  assertSpyCalls(spyFn, 1);
  assertSpyCallArg(spyFn, 0, 0, { test: 100 });

  obs2$.emit('new test');
  assertSpyCalls(spyFn, 2);
  assertSpyCallArg(spyFn, 1, 0, 'new test');
});

Deno.test('mergeArray correctly completes when all source observable complete', () => {
  const spyFn = spy();
  const obs1$ = new Subject(0);
  const obs2$ = new Subject(10);
  const merged$ = mergeArray([obs1$, obs2$]);

  merged$.subscribe({ complete: spyFn });
  obs1$.complete();
  expect(merged$.isCompleted).toBe(false);
  obs2$.complete();
  expect(merged$.isCompleted).toBe(true);
  assertSpyCalls(spyFn, 1);
});

Deno.test('mergeArray correctly error when any source observable errors', () => {
  const spyFn = spy();
  const obs1$ = new Subject(0);
  const obs2$ = new Subject(10);
  const merged$ = mergeArray([obs1$, obs2$]);

  merged$.subscribe({ error: spyFn });
  obs1$.error(new Error('a test error'));
  assertSpyCalls(spyFn, 1);
});
