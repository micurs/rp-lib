/// <reference lib="deno.ns" />

import { assertSpyCallArg, assertSpyCalls, spy } from 'jsr:@std/testing/mock';

import { mergeArray, Subject } from '../../src/index.ts';
import { expect } from 'jsr:@std/expect/expect';

Deno.test('mergeArray correctly emit when one of the merged observable emit', () => {
  const spyFn = spy();

  const obs1$ = new Subject(0);
  const obs2$ = new Subject('test');
  const obs3$ = new Subject({ test: 100 });
  const merged$ = mergeArray([obs1$, obs2$, obs3$]);

  merged$.subscribe(spyFn, false);
  obs2$.emit('new test');
  assertSpyCalls(spyFn, 1);
  assertSpyCallArg(spyFn, 0, 0, 'new test');
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
