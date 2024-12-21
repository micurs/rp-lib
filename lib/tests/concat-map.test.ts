/// <reference lib="deno.ns" />

import { expect } from "jsr:@std/expect";
import { Subject, concatMap } from "../src/index.ts";
import { defer } from "./utils.ts";

Deno.test("concatMap should map values to inner observables and emit them sequentially", async () => {
  const source$ = new Subject<number>();
  const innerObservableFactory = (value: number) => {
    const inner$ = new Subject<string>();
    setTimeout(() => {
      inner$.emit(`A${value}`);
      inner$.emit(`B${value}`);
      inner$.complete();
    }, value * 10);
    return inner$;
  };

  const result$ = concatMap(innerObservableFactory)(source$);
  const expectedValues = ["A1", "B1", "A2", "B2", "A3", "B3"];
  const receivedValues: string[] = [];

  result$.subscribe({
    next: (value: string) => receivedValues.push(value),
    complete: () => {
      expect(receivedValues).toEqual(expectedValues);
    },
  });

  source$.emit(1);
  source$.emit(2);
  source$.emit(3);
  source$.complete();

  await defer(100);
});

Deno.test("concatMap should handle errors in the source observable", async () => {
  const source$ = new Subject<number>();
  const innerObservableFactory = (value: number) => {
    const inner$ = new Subject<string>();
    setTimeout(() => {
      inner$.emit(`A${value}`);
      inner$.emit(`B${value}`);
      inner$.complete();
    }, value * 10);
    return inner$;
  };

  const result$ = concatMap(innerObservableFactory)(source$);
  const errorMessage = "Error in source observable";

  result$.subscribe({
    next: () => {},
    error: (err: Error) => {
      expect(err).toEqual(new Error(errorMessage));
    },
  });

  source$.error(new Error(errorMessage));
  await defer(50);

});

Deno.test("concatMap should handle errors in the inner observables", async () => {
  const source$ = new Subject<number>();
  const innerObservableFactory = (value: number) => {
    const inner$ = new Subject<string>();
    setTimeout(() => {
      if (value === 2) {
        inner$.error(new Error("Error in inner observable"));
      } else {
        inner$.emit(`A${value}`);
        inner$.complete();
      }
    }, value * 10);
    return inner$;
  };

  const result$ = concatMap(innerObservableFactory)(source$);

  result$.subscribe({
    next: () => {},
    error: (err: Error) => {
      expect(err).toEqual(new Error("Error in inner observable"));
    },
  });

  source$.emit(1);
  source$.emit(2);
  source$.emit(3);
  source$.complete();

  await defer(100);

});

Deno.test("concatMap should complete when all inner observables and the source complete", async () => {
  const source$ = new Subject<number>();
  const innerObservableFactory = (value: number) => {
    const inner$ = new Subject<string>();
    setTimeout(() => {
      inner$.emit(`A${value}`);
      inner$.complete();
    }, value * 10);
    return inner$;
  };

  const result$ = concatMap(innerObservableFactory)(source$);
  let isComplete = false;

  result$.subscribe({
    next: () => {},
    complete: () => {
      isComplete = true;
      expect(isComplete).toBe(true);
    },
  });

  source$.emit(1);
  source$.emit(2);
  source$.emit(3);
  source$.complete();

  await defer(100);

});
