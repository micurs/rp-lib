import { fromTimer, Signal } from '@micurs/rp-lib';

export const main = () => {
  return new Promise<void>((resolve) => {
    const source$ = Signal.fromObservable(fromTimer(10, [20, 350, 4050, 124050]), () => {
      console.log('Complete!');
      resolve();
    });
    Signal.effect(() => {
      console.log('\nsource changed to =>', source$.value);
    });

    const convertToString$ = Signal.computed(() => source$.value ? source$.value.toFixed(2) : '');
    Signal.effect(() => {
      console.log('convertToString changed to =>', convertToString$.value);
    });

    const convertToLength$ = Signal.computed(() =>
      convertToString$.value ? convertToString$.value.length : 0
    );
    Signal.effect(() => {
      console.log('convertToLength changed to =>', convertToLength$.value);
    });
  });
};

if (import.meta.main) {
  // this code is called if this module is invoked directly
  await main();
}
