import { Signal } from "@micurs/rp-lib";

const source$ = new Signal(100);
Signal.effect(() => {
  console.log('\nsource changed to =>',source$.value);
});

const isEven$ = Signal.computed(() => source$.value && source$.value % 2 === 0);
const isOdd$ = Signal.computed(() => source$.value && source$.value % 2 !== 0);

Signal.effect(() => {
  console.log('Even number detected:', isEven$.value);
});
Signal.effect(() => {
  console.log('Odd number detected:', isOdd$.value);
});

source$.emit(101);
source$.emit(102);
source$.emit(103);
source$.emit(104);