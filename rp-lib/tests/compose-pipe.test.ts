/// <reference lib="deno.ns" />

import { assertSpyCallArg, assertSpyCalls, spy } from "jsr:@std/testing/mock";

import { compose, fromArray, map, pipe } from "../index.ts";

Deno.test("pipe - accepts two map operators and produce the composition of both", () => {
  const obs$ = fromArray([1, 2, 3]);
  const result$ = pipe(
    map((x: number) => x * 2),
    map((x: number) => x + 1),
  )(obs$);
  const sub = spy();
  result$.subscribe(sub);
  assertSpyCalls(sub, 3);
  assertSpyCallArg(sub, 0, 0, 3);
  assertSpyCallArg(sub, 1, 0, 5);
  assertSpyCallArg(sub, 2, 0, 7);
});

Deno.test("compose - accepts two map operators and produce the composition of both", () => {
  const obs$ = fromArray([1, 2, 3]);
  const result$ = compose(
    map((x: number) => x + 1),
    map((x: number) => x * 2),
  )(obs$);
  const sub = spy();
  result$.subscribe(sub);
  assertSpyCalls(sub, 3);
  assertSpyCallArg(sub, 0, 0, 3);
  assertSpyCallArg(sub, 1, 0, 5);
  assertSpyCallArg(sub, 2, 0, 7);
});
