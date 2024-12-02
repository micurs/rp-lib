import { Observable, version } from "@rp/lib";

console.log(version());

const myObservable$ = new Observable<number>();
myObservable$.subscribe(val => console.log(val));
myObservable$.emit(100);
myObservable$.emit(50);
myObservable$.emit(10);
myObservable$.complete();
