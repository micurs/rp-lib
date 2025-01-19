import {
  fromArray,
  fromAsyncGenerator,
  fromGenerator,
  fromPromise,
  fromTimer,
  range,
} from '@micurs/rp-lib';

const defer = (tm = 0): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), tm);
  });
};

export const fromArrayDemo = () => {
  return new Promise<void>((resolve) => {
    const obs$ = fromArray([1, 2, 3]);
    obs$.subscribe({
      next: (t) => console.log(t),
      complete: () => {
        console.log('fromArray() complete\n');
        resolve();
      },
    });
  });
};

export const rangeDemo = () => {
  return new Promise<void>((resolve) => {
    const obs$ = range(10, 5);
    obs$.subscribe({
      next: (t) => console.log(t),
      complete: () => {
        console.log('range() complete\n');
        resolve();
      },
    });
  });
};

export const fromTimerDemo = () => {
  return new Promise<void>((resolve) => {
    const obs$ = fromTimer(100, [5, 10, 15, 20]);
    obs$.subscribe({
      next: (t) => console.log(t),
      complete: () => {
        console.log('fromTimer() complete\n');
        resolve();
      },
    });
  });
};

export const fromPromiseDemo = () => {
  const inAFew = <T>(delay: number, res: T): Promise<T> => {
    return defer(delay).then(() => res);
  };

  return new Promise<void>((resolve) => {
    const obs$ = fromPromise(inAFew(100, 'my delayed result'));
    obs$.subscribe({
      next: (t) => console.log(t),
      complete: () => {
        console.log('fromTimer() complete\n');
        resolve();
      },
    });
  });
};

export const fromGeneratorDemo = () => {
  function* countDown(count: number): Generator<number> {
    let counter = count;
    while (counter >= 0) {
      yield counter--;
    }
  }

  return new Promise<void>((resolve) => {
    const obs$ = fromGenerator(countDown(10));
    obs$.subscribe({
      next: (t) => console.log(t),
      complete: () => {
        console.log('fromGenerator() complete\n');
        resolve();
      },
    });
  });
};

export const fromAsyncGeneratorDemo = () => {
  async function* countDown(count: number, delay = 1000): AsyncGenerator<number> {
    let counter = count;
    while (counter >= 0) {
      await defer(delay);
      yield counter--;
    }
  }

  return new Promise<void>((resolve) => {
    const obs$ = fromAsyncGenerator(countDown(10, 100));
    obs$.subscribe({
      next: (t) => console.log(t),
      complete: () => {
        console.log('fromAsyncGenerator() complete\n');
        resolve();
      },
    });
  });
};

if (import.meta.main) {
  // this code is called if this module is invoked directly
  // await fromArrayDemo();
  // await rangeDemo();
  // await fromTimerDemo();
  await fromPromiseDemo();
  // await fromGeneratorDemo();
  // await fromAsyncGeneratorDemo();
}
