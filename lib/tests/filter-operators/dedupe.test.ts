import { expect } from 'jsr:@std/expect';
import { dedupe, fromArray } from '../../src/index.ts';
import { defer } from '../utils.ts';

Deno.test('dedupe does not emit the same consecutive value twice', () => {
  const receivedValues: number[] = [];
  const source$ = fromArray([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 2]);
  const result$ = dedupe<number>()(source$);
  const expectedValues = [1, 2, 3, 4, 5, 2];
  result$.subscribe((v) => receivedValues.push(v));
  expect(receivedValues).toEqual(expectedValues);
});
