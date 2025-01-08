import { Subject } from '@micurs/rp-lib';

export const main = () => {
  return new Promise<void>((resolve) => {
    console.log('Subscribing to a Subject Observable:');
    const obs$ = new Subject<number>((s) => {
      s.emit(1);
      s.emit(2);
      s.emit(3);
    });
    obs$.subscribe({
      next: console.log,
      complete: resolve,
    });

    resolve();
  });
};

if (import.meta.main) {
  // this code is called if this module is invoked directly
  main();
}
