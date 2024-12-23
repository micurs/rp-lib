/// <reference lib="deno.ns" />

import { expect } from 'jsr:@std/expect';
import { concat, Subject } from '../../src/index.ts';

Deno.test('should emit all values from the first observable before the second', () => {
  const firstSource$ = new Subject<number>();
  const secondSource$ = new Subject<number>();
  const result$ = concat<number, number>(secondSource$)(firstSource$);

  const expectedValues = [1, 2, 3, 4, 5];
  const receivedValues: number[] = [];

  result$.subscribe({
    next: (value: number) => receivedValues.push(value),
    complete: () => {
      expect(receivedValues).toEqual(expectedValues);
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

Deno.test('should emit all values from the second observable before the first', () => {
  const firstSource$ = new Subject<number>();
  const secondSource$ = new Subject<number>();
  const result$ = concat<number, number>(secondSource$)(firstSource$);

  const expectedValues = [1, 2, 3, 4, 5];
  const receivedValues: number[] = [];

  result$.subscribe({
    next: (value: number) => receivedValues.push(value),
    complete: () => {
      expect(receivedValues).toEqual(expectedValues);
    },
  });

  secondSource$.emit(3);
  secondSource$.emit(4);
  secondSource$.emit(5);
  secondSource$.complete();
  firstSource$.emit(1);
  firstSource$.emit(2);
  firstSource$.complete();
});

Deno.test('should handle errors in the first observable', () => {
  const firstSource$ = new Subject<number>();
  const secondSource$ = new Subject<number>();
  const result$ = concat<number, number>(secondSource$)(firstSource$);
  const errorMessage = 'Error in first observable';

  result$.subscribe({
    next: () => {},
    error: (err: Error) => {
      expect(err).toEqual(new Error(errorMessage));
    },
  });

  firstSource$.error(new Error(errorMessage));
});

Deno.test('should handle errors in the second observable', () => {
  const firstSource$ = new Subject<number>();
  const secondSource$ = new Subject<number>();
  const result$ = concat<number, number>(secondSource$)(firstSource$);
  const errorMessage = 'Error in second observable';

  result$.subscribe({
    next: () => {},
    error: (err: Error) => {
      expect(err).toEqual(new Error(errorMessage));
    },
  });

  firstSource$.complete();
  secondSource$.error(new Error(errorMessage));
});

Deno.test('should complete when both observables complete', () => {
  const firstSource$ = new Subject<number>();
  const secondSource$ = new Subject<number>();
  const result$ = concat<number, number>(secondSource$)(firstSource$);
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

Deno.test('should emit values from the second observable even if the first observable emits nothing', () => {
  const firstSource$ = new Subject<number>();
  const secondSource$ = new Subject<number>();
  const result$ = concat<number, number>(secondSource$)(firstSource$);
  const expectedValues = [1, 2, 3];
  const receivedValues: number[] = [];

  result$.subscribe({
    next: (value: number) => receivedValues.push(value),
    complete: () => {
      expect(receivedValues).toEqual(expectedValues);
    },
  });

  firstSource$.complete();
  secondSource$.emit(1);
  secondSource$.emit(2);
  secondSource$.emit(3);
  secondSource$.complete();
});
