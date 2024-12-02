/// <reference lib="deno.ns" />
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";

import { from, switchMap } from "../index.ts";

Deno.test("switchMap", () => {
  const numbers$ = from(1, 2, 3);
  const mapFn = (x: number) => from(x, x ** 2, x ** 3);
  const sub = spy();

  const result$ = switchMap(mapFn)(numbers$);

  result$.subscribe(sub);
  assertSpyCalls(sub, 9);
});
