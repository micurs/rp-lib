import { concatMap, fromTimer } from '@micurs/rp-lib';

export const main = () => {
  return new Promise<void>((resolve) => {
    console.log('Subscribing to a concatMap Observable:');
    // The root observable emits three values at 500 ms interval
    const series1$ = fromTimer(1000, [1, 4, 8]);

    const mapfn = (val: number) =>
      fromTimer(100, Array.from({ length: 5 }, (_, idx) => val * 10 + idx));

    const concatMapSeries$ = concatMap(mapfn)(series1$);

    series1$.subscribe({
      next: (x) => console.log('>', x),
    });
    concatMapSeries$.subscribe({
      next: console.log,
      complete: () => {
        console.log('complete');
        resolve();
      },
    });
  });
};

if (import.meta.main) {
  // this code is called if this module is invoked directly
  await main();
}
