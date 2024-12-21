/// <reference lib="deno.ns" />

import { assertSpyCallArg, assertSpyCalls, spy } from "jsr:@std/testing/mock";

import { from, map, Subject, tap } from "../../src/index.ts";

Deno.test("tap operator - call the provided function with each value", () => {
  const obs$ = from(1, 2, 3);
  const spyTapFn = spy();
  const spySubFn = spy();
  const result$ = tap(spyTapFn)(obs$);
  result$.subscribe(spySubFn);
  assertSpyCalls(spySubFn, 3);
  assertSpyCalls(spyTapFn, 3);
});

Deno.test("tap operator - not call the provided function if original observable emit error", () => {
  const obs$ = new Subject();
  obs$.error(new Error("Test Error"));

  const spyTapFn = spy();
  const spySubFn = spy();
  const result$ = tap(spyTapFn)(obs$);
  result$.subscribe(spySubFn);

  assertSpyCalls(spySubFn, 0);
});

Deno.test("map operator - call the provided function to emit transformed values", () => {
  const obs$ = from(1, 2, 3);
  const spyMapFn = spy((x: number) => {
    return x * 2;
  });
  const spySubFn = spy();
  const result$ = map(spyMapFn)(obs$);
  result$.subscribe(spySubFn);
  assertSpyCallArg(spySubFn, 0, 0, 2);
  assertSpyCallArg(spySubFn, 1, 0, 4);
  assertSpyCallArg(spySubFn, 2, 0, 6);
});

Deno.test("map operator - not call the provided function if original observable emit error", () => {
  const obs$ = new Subject();
  obs$.error(new Error("Test Error"));

  const spyTapFn = spy();
  const spySubFn = spy();
  const result$ = map(spyTapFn)(obs$);
  result$.subscribe(spySubFn);
  assertSpyCalls(spySubFn, 0);
});
