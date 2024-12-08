
import { fromTimer, concatMap } from "@micurs/rp-lib";

export const main = () => {
  // The root observable emits three values at 500 ms interval
  const series1$ = fromTimer(1000, [1, 4, 8]);

  const mapfn = (val: number) =>
    fromTimer(600, Array.from({length: 5}, (_, idx) => val*10+idx));

  const concatMapSeries$ = concatMap(mapfn)(series1$);

  concatMapSeries$.subscribe(x => console.log(x));
}
