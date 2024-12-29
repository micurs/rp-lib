import { expect } from 'jsr:@std/expect';
import { fromArray, throttle } from '../../src/index.ts';

Deno.test('throttle should emit only one value if the original observable emits all the values in the given time', async () => {
  const source$ = fromArray([1, 2, 3, 4, 5]);
  const result$ = throttle<number>(10)(source$);
  const res: Array<number> = [];

  result$.subscribe({
    next: (value: number) => {
      res.push(value);
    },
    complete: () => {
      expect(res).toEqual([1]);
    },
  });
});
