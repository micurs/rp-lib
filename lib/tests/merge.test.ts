import { Subject, merge } from "../src/index.ts";
import { expect } from "jsr:@std/expect";

Deno.test("merge should emit values from both observables", () => {
  const firstSource$ = new Subject<number>();
  const secondSource$ = new Subject<number>();
  const result$ = merge<number, number>(secondSource$)(firstSource$);

  const expectedValues = [1, 2, 3, 4, 5, 6];
  const receivedValues: number[] = [];

  result$.subscribe({
    next: (value: number) => receivedValues.push(value),
    complete: () => {
      expect(receivedValues.sort()).toEqual(expectedValues);
    },
  });

  firstSource$.emit(1);
  secondSource$.emit(4);
  firstSource$.emit(2);
  secondSource$.emit(5);
  firstSource$.emit(3);
  secondSource$.emit(6);
  firstSource$.complete();
  secondSource$.complete();
});

Deno.test("merge should complete when both observables complete", () => {
  const firstSource$ = new Subject<number>();
  const secondSource$ = new Subject<number>();
  const result$ = merge<number, number>(secondSource$)(firstSource$);

  let isComplete = false;

  result$.subscribe({
    next: () => {},
    complete: () => {
      isComplete = true;
      expect(isComplete).toBe(true);
    },
  });

  firstSource$.complete();
  secondSource$.complete();
});

Deno.test("merge should handle errors in the first observable", () => {
  const firstSource$ = new Subject<number>();
  const secondSource$ = new Subject<number>();
  const result$ = merge<number, number>(secondSource$)(firstSource$);
  const errorMessage = "Error in first observable";

  result$.subscribe({
    next: () => {},
    error: (err: Error) => {
      expect(err).toEqual(new Error(errorMessage));
    },
  });

  firstSource$.error(new Error(errorMessage));
});

Deno.test("merge should handle errors in the second observable", () => {
  const firstSource$ = new Subject<number>();
  const secondSource$ = new Subject<number>();
  const result$ = merge<number, number>(secondSource$)(firstSource$);
  const errorMessage = "Error in second observable";

  result$.subscribe({
    next: () => {},
    error: (err: Error) => {
      expect(err).toEqual(new Error(errorMessage));
    },
  });

  secondSource$.error(new Error(errorMessage));
});

Deno.test("merge should emit values even if one observable completes early", () => {
  const firstSource$ = new Subject<number>();
  const secondSource$ = new Subject<number>();
  const result$ = merge<number, number>(secondSource$)(firstSource$);

  const expectedValues = [1, 2, 3, 4, 5];
  const receivedValues: number[] = [];

  result$.subscribe({
    next: (value: number) => receivedValues.push(value),
    complete: () => {
      expect(receivedValues.sort()).toEqual(expectedValues);
    },
  });

  firstSource$.emit(1);
  firstSource$.emit(2);
  firstSource$.complete();
  secondSource$.emit(3);
  secondSource$.emit(4);
  secondSource$.emit(5);
  secondSource$.complete();
});

Deno.test("merge should emit values if the first observable completes after the second", () => {
  const firstSource$ = new Subject<number>();
  const secondSource$ = new Subject<number>();
  const result$ = merge<number, number>(secondSource$)(firstSource$);

  const expectedValues = [1, 2, 3, 4, 5];
  const receivedValues: number[] = [];

  result$.subscribe({
    next: (value: number) => receivedValues.push(value),
    complete: () => {
      expect(receivedValues.sort()).toEqual(expectedValues);
    },
  });

  secondSource$.emit(1);
  secondSource$.emit(2);
  secondSource$.complete();
  firstSource$.emit(3);
  firstSource$.emit(4);
  firstSource$.emit(5);
  firstSource$.complete();
});
