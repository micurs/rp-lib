import { Signal } from '@micurs/rp-lib';

export const main = () => {
  return new Promise<void>((resolve) => {
    const source1$ = new Signal(100);
    const source2$ = new Signal(200);

    const combined$ = Signal.computed(() => {
      return source1$.value && source2$.value ? source1$.value * source2$.value : 0;
    });

    Signal.effect(() => {
      console.log('combined$ is now =>', combined$.value);
    });

    source1$.emit(12);
    source2$.emit(2);

    source2$.emit(10);
    source2$.emit(100);
    source2$.emit(1500);
    console.log('complete!');
    resolve();
  });
};

if (import.meta.main) {
  // this code is called if this module is invoked directly
  await main();
}
