import { expect } from 'jsr:@std/expect';
import { fromArray, throttle } from '../../src/index.ts';

Deno.test('throttle should emit only one value if the original observable emits all the values in the given time', () => {
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

Deno.test('throttle emit the last value after the throttle time after the source completes', async () => {
  const source$ = fromArray([1, 2, 3, 4, 5]);
  const result$ = throttle<number>(10)(source$);
  const res: Array<number> = [];
  let time = Date.now() - 10; // The first emission will be immediate
  result$.subscribe({
    next: (value: number) => {
      expect(Date.now() - time).toBeGreaterThanOrEqual(10);
      time = Date.now();
      res.push(value);
    },
    complete: () => {
      // First and last value should be emitted.
      expect(res).toEqual([1, 5]);
    },
  });
  await new Promise((resolve) => setTimeout(resolve, 50));
});
