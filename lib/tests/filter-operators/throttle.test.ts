import { expect } from 'jsr:@std/expect';
import { fromArray, fromTimer, throttle } from '../../src/index.ts';
import { defer } from '../utils.ts';

Deno.test('throttle should emit only one value if the original observable emits all the values in the given time', async () => {
  const source$ = fromArray([1, 2, 3, 4, 5]);
  const result$ = throttle<number>(10)(source$);
  const res: Array<number> = [];

  result$.subscribe({
    next: (value: number) => {
      res.push(value);
    },
    complete: () => {
      expect(res).toEqual([1, 5]);
    },
  });

  await defer(30);
});

Deno.test('throttle emit the last value after the throttle time after the source completes', async () => {
  const throttleTime = 100;
  const source$ = fromTimer(20, [1, 2, 3, 4, 5, 6]);
  const result$ = throttle<number>(100)(source$);
  const res: Array<number> = [];
  let time = Date.now() - throttleTime; // The first emission will be immediate
  result$.subscribe({
    next: (value: number) => {
      const now = Date.now();
      // console.log(value, ' > Delta Time: ', now - time);
      expect(now - time).toBeGreaterThanOrEqual(throttleTime);
      time = now;
      res.push(value);
    },
    complete: () => {
      // First and last value should be emitted.
      expect(res).toEqual([1, 5, 6]);
    },
  });
  await new Promise((resolve) => setTimeout(resolve, throttleTime * 3));
});

Deno.test('throttle emit all the source values if they are time spaced enough', async () => {
  const source$ = fromTimer(11, [1, 2, 3, 4, 5]);
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
      expect(res).toEqual([1, 2, 3, 4, 5]);
    },
  });
  await defer(100);
});
