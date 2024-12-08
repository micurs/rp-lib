import { fromTimer, switchMap } from "@micurs/rp-lib";

export const main = () => {
  // The root observable emits three values at 500 ms interval
  const series1$ = fromTimer(500, [1, 2, 3]);

  // const log = pipe<number, number>(
  //   tap((val) => console.log(`${timerId}\t${val}`)),
  // );

  const switchMapSeries$ = switchMap(
    // for each emitted value from the root observable a new one is created
    // emitting 10 values with a frequency of 200 ms.
    (val: number) => fromTimer(200,Array.from({length: 10}, (_, idx) => val*100+ idx)),
  )(series1$);

  switchMapSeries$.subscribe({
    next: console.log,
    complete: () => console.log("complete")
  });
};