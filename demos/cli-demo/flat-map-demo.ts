import { flatMap, fromTimer, pipe } from '@micurs/rp-lib';

export const main = () => {
  return new Promise<void>((resolve) => {
    const source$ = fromTimer(50, [1, 10, 30]);
    const target$ = pipe(
      flatMap((x: number) => fromTimer(20, [x * 10, x * 10 + 1, x * 10 + 2, x * 10 + 3])),
    )(source$);

    const startTm = Date.now();
    target$.subscribe({
      next: (v) => console.log(`${(Date.now() - startTm).toFixed(2)} > "${v}"`),
      complete: () => {
        console.log('Complete flat-map');
        resolve();
      },
    });
  });
};

if (import.meta.main) {
  // this code is called if this module is invoked directly
  await main();
}
