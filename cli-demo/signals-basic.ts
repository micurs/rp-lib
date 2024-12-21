import { Signal } from "@micurs/rp-lib";


const signal = new Signal(100);

Signal.effect(() => {
  console.log(signal.value);
});

signal.emit(200);
signal.emit(300);
signal.emit(400);
