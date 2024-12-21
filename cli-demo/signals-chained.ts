import { Signal } from "@micurs/rp-lib";

const source$ = new Signal(100);
Signal.effect(() => {
  console.log('\nsource changed to =>',source$.value);
});


const convertToString$ = Signal.computed(() => source$.value ? source$.value.toFixed(2) : '');
Signal.effect(() => {
  console.log('convertToString changed to =>',convertToString$.value);
});

const convertToLength$ = Signal.computed(() => convertToString$.value ? convertToString$.value.length : 0);
Signal.effect(() => {
  console.log('convertToLength changed to =>',convertToLength$.value);
});

source$.emit(20);
source$.emit(350);
source$.emit(4050);
source$.emit(124050);