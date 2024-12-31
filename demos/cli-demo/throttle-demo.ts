import { fromTimer, throttle } from '@micurs/rp-lib';

export const main = () => {
  return new Promise<void>((resolve) => {
    console.log('Subscribing to a throttled Observable emitting at most once per second:');
    const source$ = fromTimer(400, [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4], [1, 2, 3, 4, 5]]);
    const throttled$ = throttle<number[]>(1000)(source$);

    console.log(
      'Throttling source to 1 emissions per second. Some source emissions will be lost ...',
    );

    source$.subscribe((x) => console.log('>', x));
    throttled$.subscribe({
      next: (value: number[]) => console.log('\t', value),
      complete: () => {
        console.log('Complete!');
        resolve();
      },
    });
  });
};

if (import.meta.main) {
  // this code is called if this module is invoked directly
  await main();
}
