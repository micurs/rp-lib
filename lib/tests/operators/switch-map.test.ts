/// <reference lib="deno.ns" />
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { from, switchMap, Subject } from "../../src/index.ts";
import { expect } from "jsr:@std/expect";
import { defer } from "../utils.ts";

Deno.test("switchMap should map and switch inner observables correctly", () => {
  const numbers$ = from(1, 2, 3);
  const mapFn = (x: number) => from(x, x ** 2, x ** 3);
  const sub = spy();

  const result$ = switchMap(mapFn)(numbers$);

  result$.subscribe(sub);
  assertSpyCalls(sub, 9);
});

Deno.test("switchMap should handle an observable emitting multiple times", () => {
  const source$ = from(1,2,3);
  const mapFn = (x: number) => from(x, x + 1);
  const sub = spy();

  const result$ = switchMap(mapFn)(source$);

  result$.subscribe(sub);

  assertSpyCalls(sub, 6); // 2 emissions per number, but the previous ones are canceled
});

Deno.test("switchMap should cancel previous inner observables when a new value is emitted", async () => {
  const source$ = from(1, 2, 3);
  const mapFn = (x: number) => {
    const inner$ = new Subject<number>();
    setTimeout(() => {
      inner$.emit(x);
      inner$.emit(x + 1);
      inner$.complete();
    }, x * 10);
    return inner$;
  };
  const sub = spy();

  const result$ = switchMap(mapFn)(source$);
  result$.subscribe(sub);

  await defer(100);
  assertSpyCalls(sub, 2); // Only the last observable's emissions (3, 4) are received
});

Deno.test("switchMap should complete when the source observable completes", () => {
  const source$ = from(1,2);
  const mapFn = (x: number) => from(x, x * 2);
  const sub = spy();

  const result$ = switchMap(mapFn)(source$);

  let isComplete = false;

  result$.subscribe({
    next: sub,
    complete: () => {
      isComplete = true;
    },
  });

  assertSpyCalls(sub, 4); // Each number maps to 2 emissions (x, x*2)
  expect(isComplete).toBe(true);
});

Deno.test("switchMap should handle errors in the source observable", () => {
  const source$ = new Subject<number>();
  const mapFn = (x: number) => from(x, x * 2);
  const sub = spy();
  const errorMessage = "Error in source observable";

  const result$ = switchMap(mapFn)(source$);

  let errorCaught = false;

  result$.subscribe({
    next: sub,
    error: (err) => {
      errorCaught = true;
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe(errorMessage);
    },
  });

  source$.error(new Error(errorMessage));
  expect(errorCaught).toBe(true);
});

Deno.test("switchMap should handle errors in the inner observable", async () => {
  const source$ = new Subject<number>();
  const mapFn = (x: number) => {
    const inner$ = new Subject<number>();
    setTimeout(() => {
      inner$.error(new Error("Error in inner observable"));
    }, x * 10);
    return inner$;
  };
  const sub = spy();
  const result$ = switchMap(mapFn)(source$);

  let errorCaught = false;

  result$.subscribe({
    next: sub,
    error: (err) => {
      errorCaught = true;
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Error in inner observable");
    },
  });

  source$.emit(1);
  await defer(100);
  expect(errorCaught).toBe(true);
});
