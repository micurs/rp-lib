import { concatMap, fromArray, fromPromise, map, pipe, reduce } from '@micurs/rp-lib';

// const defer = (tm = 0) => <T>(fn: () => T): Promise<T> => {
//   return new Promise<T>((resolve) => {
//     setTimeout(() => resolve(fn()), tm);
//   });
// };

const defer = (tm = 0): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), tm);
  });
};

export const main = () => {
  return new Promise<void>((resolve) => {
    const source$ = fromArray<[number, string]>(
      [[1.6, 'firstValue'], [2.3, 'secondValue'], [1.4, 'thirdValue']],
    );

    const transformed$ = pipe<
      [number, string], // source data
      [number, string], // Convert sec to milliseconds
      Promise<string>, // Reduce to Promises
      string // Concat and map to string
    >(
      map(([sec, val]) => [sec * 1000, val]),
      reduce((prevDelay, [delayMs, value]) =>
        prevDelay.then(
          (outVal: string) => defer(delayMs).then(() => `${outVal} > ${value}`),
        ), Promise.resolve('start')),
      concatMap(fromPromise),
    )(source$);

    const startTime = Date.now();
    transformed$.subscribe({
      next: (v) =>
        console.log(`at ${((Date.now() - startTime) / 1000).toFixed(2)} sec - emit: "${v}"`),
      complete: () => {
        console.log('map-reduce complete');
        resolve();
      },
    });
  });
};

if (import.meta.main) {
  // this code is called if this module is invoked directly
  await main();
}
