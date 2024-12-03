/// <reference lib="deno.ns" />

import { assertSpyCallArg, assertSpyCalls, spy } from "jsr:@std/testing/mock";

import {
  defer,
  flatMap,
  from,
  fromAsyncGenerator,
  fromPromise,
  interval,
  map,
} from "../src/index.ts";

Deno.test("Operator flatMap flattens the result of a mapped observable", async () => {
  // A generator that emits 3 values after 5, 10 and 15 ms
  const generator = async function* () {
    yield await defer(0).then(() => 1);
    yield await defer(10).then(() => 2);
    yield await defer(10).then(() => 3);
  };
  // A map function that create observable that emit a value after 1 ms
  const mapFn = (value: number) => fromPromise(defer(1).then(() => value + 1));

  // Create an observable from the generator
  const obs$ = fromAsyncGenerator(generator());

  // Apply the flatMap operator to the observable
  const result$ = flatMap(mapFn)(obs$);

  const complete = spy();
  const next = spy();
  result$.subscribe({ next, complete });

  await defer(50); // wait for all the values from the root observable to be emitted

  assertSpyCalls(next, 3);
  assertSpyCalls(complete, 1);
  assertSpyCallArg(next, 0, 0, 2);
  assertSpyCallArg(next, 1, 0, 3);
  assertSpyCallArg(next, 2, 0, 4);
});

Deno.test("Operator flatMap - emit values combining source and mapped observable", async () => {
  const letters$ = from("a", "b", "c");
  const flatMapFn = (x: string) =>
    map((i: number) => x + i)(
      interval(10, "onSubscribe", 2),
    );
  const result$ = flatMap(flatMapFn)(letters$);
  const next = spy();
  const complete = spy();
  result$.subscribe({ next, complete });
  await defer(100);
  assertSpyCalls(next, 6);
  assertSpyCalls(complete, 1);
  assertSpyCallArg(next, 0, 0, "a0");
  assertSpyCallArg(next, 1, 0, "b0");
  assertSpyCallArg(next, 2, 0, "c0");
  assertSpyCallArg(next, 3, 0, "a1");
  assertSpyCallArg(next, 4, 0, "b1");
  assertSpyCallArg(next, 5, 0, "c1");
});
