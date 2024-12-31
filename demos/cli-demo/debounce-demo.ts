import { debounce, fromTimer } from '@micurs/rp-lib';

export const main = () => {
  return new Promise<void>((resolve) => {
    console.log('Subscribing to a debounced Observable emitting at most once per second:');
    const source$ = fromTimer(10, [1, 2, 3, 4, 5]);

    console.log('Debouncing source to 1 emissions per second ...');
    const debounced$ = debounce<number>(1000)(source$);

    source$.subscribe((x) => console.log('>', x));
    debounced$.subscribe({
      next: (value: number) => console.log(value),
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
