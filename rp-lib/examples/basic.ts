import { Subject } from "../src/index.ts";

const obs$ = new Subject<number>();
obs$.subscribe(console.log);

obs$.emit(1);
obs$.emit(2);
obs$.emit(3);
