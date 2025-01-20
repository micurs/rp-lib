/// <reference lib="deno.ns" />

import { assertSpyCallArg, assertSpyCalls, spy } from 'jsr:@std/testing/mock';

import { fromArray, reduce } from '../../src/index.ts';

Deno.test('reduce() operator produces an observable that emits the reduced values', () => {
  const obs$ = fromArray([1, 1, 1]);
  const sub = spy();
  const trg$ = reduce((acc: number, v: number) => acc + v, 0)(obs$);
  trg$.subscribe(sub);
  assertSpyCalls(sub, 3);
  assertSpyCallArg(sub, 0, 0, 1);
  assertSpyCallArg(sub, 1, 0, 2);
  assertSpyCallArg(sub, 2, 0, 3);
});
