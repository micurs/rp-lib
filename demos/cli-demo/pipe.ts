import { debounce, delay, fromTimer, map, merge, pipe } from '@micurs/rp-lib';

export const main = () => {
  return new Promise<void>((resolve) => {
    const source1$ = fromTimer(100, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    const source2$ = fromTimer(100, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);
    const out$ = pipe(
      merge( // merge another observable into the source
        delay(50)(source2$), // delays source2$ by 50ms but maintains its rhythms
      ),
      debounce(100), // only emits from source every 500ms (it buffers values)
      map((x) => ({ data: x })),
    )(source1$);

    let tm = Date.now();
    out$.subscribe({
      next: (v) => {
        const now = Date.now();
        console.log(`${now - tm} ms :`, v);
        tm = now;
      },
      complete: resolve,
    });
  });
};

if (import.meta.main) {
  // this code is called if this module is invoked directly
  await main();
}
