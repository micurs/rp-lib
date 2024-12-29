/// <reference lib="deno.ns" />
import { expect } from 'jsr:@std/expect';
import { filter, fromArray } from '../../src/index.ts';

Deno.test('filter should filter values based on a predicate', () => {
  const res: number[] = [];
  const source$ = fromArray([1, 2, 3, 4, 5]);
  const predicate = (value: number) => value % 2 === 0;
  const result$ = filter(predicate)(source$);
  const expectedValues = [2, 4];

  result$.subscribe({
    next: (value: number) => res.push(value),
    complete: () => expect(res).toEqual(expectedValues),
  });
});

Deno.test('filter should filter values based on a predicate', () => {
  const res: number[] = [];
  const source$ = fromArray([1, 3, 12, 43, 15]);
  const predicate = (_value: number, idx: number) => idx % 2 === 0;
  const result$ = filter(predicate)(source$);
  const expectedValues = [1, 12, 15];

  result$.subscribe({
    next: (value: number) => res.push(value),
    complete: () => expect(res).toEqual(expectedValues),
  });
});
