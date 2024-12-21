import { Subject } from "@micurs/rp-lib";

export const main = () => {
  console.log("Subscribing to a Subject Observable:");
  const obs$ = new Subject<number>();
  obs$.subscribe(console.log);

  obs$.emit(1);
  obs$.emit(2);
  obs$.emit(3);
};

