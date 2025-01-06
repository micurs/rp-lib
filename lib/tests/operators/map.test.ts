/// <reference lib="deno.ns" />

import { assertSpyCallArg, assertSpyCalls, spy } from 'jsr:@std/testing/mock';

import { fromArray, map } from '../../src/index.ts';

Deno.test('map() operator produces an observable that emits the mapped values', () => {
  const obs$ = fromArray([1, 2, 3]);
  const sub = spy();
  const trg$ = map((x: number) => x + 1)(obs$);
  trg$.subscribe(sub);
  assertSpyCalls(sub, 3);
  assertSpyCallArg(sub, 0, 0, 2);
  assertSpyCallArg(sub, 1, 0, 3);
  assertSpyCallArg(sub, 2, 0, 4);
});
