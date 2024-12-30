import { fromTimer, Signal } from '@micurs/rp-lib';

export const main = () => {
  return new Promise<void>((resolve) => {
    const source$ = Signal.fromObservable(
      fromTimer(100, [100, 101, 102, 103, 104]),
      () => {
        console.log('Complete!');
        resolve();
      },
    );
    Signal.effect(() => {
      console.log('\nsource changed to =>', source$.value);
    });

    const isEven$ = Signal.computed(() => source$.value && source$.value % 2 === 0);
    const isOdd$ = Signal.computed(() => source$.value && source$.value % 2 !== 0);

    Signal.effect(() => {
      console.log('Even number detected:', isEven$.value);
    });
    Signal.effect(() => {
      console.log('Odd number detected:', isOdd$.value);
    });
  });
};

if (import.meta.main) {
  // this code is called if this module is invoked directly
  await main();
}
