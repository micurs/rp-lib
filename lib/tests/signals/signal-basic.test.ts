/// <reference lib="deno.ns" />

import { assertSpyCalls, spy } from "jsr:@std/testing/mock";

import { Signal } from "../../../lib/src/signals/signal.ts";


Deno.test("Creating an effect function with a signal", () => {
  const signal = new Signal(100);
  const effect = spy(() => { console.log("spy1 called", signal.value) });
  Signal.effect(effect);
  assertSpyCalls(effect, 1);
});


Deno.test("Emitting a value on a signal calls the effect function", () => {
  const signal = new Signal(100);
  const effect = spy(() => { console.log("spy1 called", signal.value) });
  Signal.effect(effect);
  signal.value = 200;
  assertSpyCalls(effect, 2);
});

Deno.test("Disabling an effect function stops it from being called", () => {
  const signal = new Signal(100);
  const effect = spy(() => { console.log("spy1 called", signal.value) });
  const disableEffect = Signal.effect(effect);
  disableEffect();
  signal.value = 200;
  assertSpyCalls(effect, 1);
});

Deno.test('A computed signal effect function is called when a dependent signal changes', () => {
  const signal1 = new Signal(100);
  const computedSignal = Signal.computed(() => signal1.value ? signal1.value.toFixed(2) : '');
  const effect = spy(() => { console.log('computed signal changed to =>', computedSignal.value) });
  Signal.effect(effect);
  signal1.value = 200;
  assertSpyCalls(effect, 2);
});

Deno.test('Two computed signals emit their computed values when their dependent signal changes', () => {
  const source = new Signal(100);
  const computed1 = Signal.computed(() => source.value && source.value % 2 === 0);
  const computed2 = Signal.computed(() => source.value && source.value % 2 !== 0);
  const effect = spy(() => {
    console.log('computed signals changed to =>', computed1.value, computed2.value);
  });
  Signal.effect(effect);
  source.value = 200;
  assertSpyCalls(effect, 3);
});


Deno.test('Two computed signals emit their computed values when their dependent signal changes', () => {
  const source1 = new Signal(100);
  const source2 = new Signal(300);
  const computed = Signal.computed(() => source1.value! + source2.value!);
  const effect = spy(() => {
    console.log('computed signals changed to =>', computed.value);
  });
  Signal.effect(effect);
  source1.value = 200;
  assertSpyCalls(effect, 2);
});


Deno.test('Two computed signals emit their computed values when their dependent signal changes', () => {
  const source1 = new Signal(0);
  const computed1 = Signal.computed(() => source1.value! + 100);
  const computed2 = Signal.computed(() => computed1.value! + 100);
  const effect = spy(() => {
    console.log('computed2 signals changed to =>', computed2.value);
  });
  Signal.effect(effect);
  source1.value = 1000;
  assertSpyCalls(effect, 2);
})