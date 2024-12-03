/// <reference lib="deno.ns" />

import { expect } from "jsr:@std/expect";
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";

import { Subject } from "../src/index.ts";

Deno.test("Creates an observable", () => {
  const obs$ = new Subject(10);
  expect(obs$.lastValue).toBe(10);
});

Deno.test("Creates an observable and emit a value", () => {
  const obs$ = new Subject(10);
  obs$.emit(100);
  expect(obs$.lastValue).toBe(100);
});

Deno.test("Creates an observable and subscribe with a function", () => {
  const obs$ = new Subject(10);
  obs$.subscribe((value) => {
    expect(value).toBe(10);
  });
});

Deno.test("Creates an observable and subscribe with a function", () => {
  const sub = spy();
  const obs$ = new Subject(10);
  obs$.subscribe(sub);
  obs$.emit(100);
  assertSpyCalls(sub, 2);
});

Deno.test("Creates an observable and subscribe with a full FullSubscriber", () => {
  const sub = {
    next: spy(),
    complete: spy(),
  };
  const obs$ = new Subject(10);
  obs$.subscribe(sub);
  obs$.complete();
  assertSpyCalls(sub.next, 1);
  assertSpyCalls(sub.complete, 1);
});

Deno.test("Creates an observable and ensure emit after a complete do not work", () => {
  const sub = {
    next: spy(),
    complete: spy(),
  };
  const obs$ = new Subject();
  obs$.subscribe(sub);
  obs$.complete();
  obs$.emit(100);
  assertSpyCalls(sub.next, 0);
  assertSpyCalls(sub.complete, 1);
});

Deno.test("Creates an observable and ensure error trigger error in subscriber", () => {
  const sub = {
    next: spy(),
    error: spy(),
  };
  const obs$ = new Subject();
  obs$.subscribe(sub);
  obs$.error(new Error("A test error"));
  assertSpyCalls(sub.error, 1);
});

Deno.test("Creates an observable and ensure unsubscribe remove the subscriber correctly", () => {
  const sub = spy();
  const obs$ = new Subject();
  const subscription = obs$.subscribe(sub);
  subscription.unsubscribe();
  obs$.emit(100);
  assertSpyCalls(sub, 0);
});

Deno.test("Subscribing twice won't subscribe 2 times the same function", () => {
  const sub = spy();
  const obs$ = new Subject();
  obs$.subscribe(sub);
  obs$.subscribe(sub);
  obs$.emit(100);
  assertSpyCalls(sub, 1);
});

Deno.test("Subscribing to an observable with an error will emit error", () => {
  const sub = {
    next: spy(),
    error: spy(),
  };
  const obs$ = new Subject();
  obs$.error(new Error("Test Error"));
  obs$.subscribe(sub);
  assertSpyCalls(sub.error, 1);
});
