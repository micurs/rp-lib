import { Subject } from '@micurs/rp-lib';

export const main = () => {
  return new Promise<void>((resolve) => {
    console.log('Subscribing to a Subject Observable:');
    const obs$ = new Subject<number>();
    obs$.subscribe({
      next: console.log,
      complete: resolve,
    });

    obs$.emit(1);
    obs$.emit(2);
    obs$.emit(3);
    resolve();
  });
};

if (import.meta.main) {
  // this code is called if this module is invoked directly
  main();
}
