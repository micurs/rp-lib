import { Signal } from '@micurs/rp-lib';

export const main = () => {
  return new Promise<void>((resolve) => {
    console.log('Subscribing to a Signal using effect()');
    const signal = new Signal(100);

    Signal.effect(() => {
      console.log(signal.value);
    });

    signal.emit(200);
    signal.emit(300);
    signal.emit(400);
    console.log('Complete!');
    resolve();
  });
};

if (import.meta.main) {
  // this code is called if this module is invoked directly
  await main();
}
