import { expect } from 'jsr:@std/expect';
import { debounce, fromArray, fromTimer } from '../../src/index.ts';

Deno.test('debounce should emit all the values with the given frequency', async () => {
  const expectedInterval = 10;

  const res: Array<[number, number]> = [];
  const source$ = fromArray([1, 2, 3, 4, 5]);
  const result$ = debounce<number>(10)(source$);
  const expectedValues = [1, 2, 3, 4, 5];

  let lastEmissionTime = Date.now();
  result$.subscribe({
    next: (value: number) => {
      res.push([Date.now(), value]);
    },
    complete: () => {
      expect(res.length).toEqual(5);
      const receivedValues = res.map(([_time, value]) => value);
      expect(receivedValues).toEqual(expectedValues);
      const [firstEmission, ...otherEmissions] = res;
      lastEmissionTime = firstEmission[0];
      otherEmissions.forEach(([time, _value]) => {
        const diff = time - lastEmissionTime;
        expect(diff).toBeGreaterThanOrEqual(expectedInterval);
        lastEmissionTime = time;
      });
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 100));
});

Deno.test('debounce should emit all the values when emitted if the frequency is larger than the debounce time', async () => {
  const expectedInterval = 20;
  const res: Array<[number, number]> = [];
  const source$ = fromTimer(expectedInterval, [1, 2, 3, 4, 5]);
  const result$ = debounce<number>(10)(source$);
  const expectedValues = [1, 2, 3, 4, 5];

  let lastEmissionTime = Date.now();
  result$.subscribe({
    next: (value: number) => {
      res.push([Date.now(), value]);
    },
    complete: () => {
      expect(res.length).toEqual(5);
      const receivedValues = res.map(([_time, value]) => value);
      expect(receivedValues).toEqual(expectedValues);
      const [firstEmission, ...otherEmissions] = res;
      lastEmissionTime = firstEmission[0];
      otherEmissions.forEach(([time, _value]) => {
        const diff = time - lastEmissionTime;
        expect(diff).toBeGreaterThanOrEqual(expectedInterval);
        lastEmissionTime = time;
      });
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 200));
});
