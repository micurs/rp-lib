/// <reference lib="deno.ns" />

import { assertSpyCalls, spy } from 'jsr:@std/testing/mock';
import { expect } from 'jsr:@std/expect';

import { Signal, Subject } from '../../src/index.ts';

Deno.test('Creating an effect function with a signal', () => {
  const signal = new Signal(100);
  const effect = spy(() => {
    console.log('spy1 called', signal.value);
  });
  Signal.effect(effect);
  assertSpyCalls(effect, 1);
});

Deno.test('Emitting a value on a signal calls the effect function', () => {
  const signal = new Signal(100);
  const effect = spy(() => {
    console.log('spy1 called', signal.value);
  });
  Signal.effect(effect);
  expect(signal.value).toBe(100);
  signal.value = 200;
  expect(signal.value).toBe(200);
  assertSpyCalls(effect, 2);
});

Deno.test('Disabling an effect function stops it from being called', () => {
  const signal = new Signal(100);
  const effect = spy(() => {
    console.log('spy1 called', signal.value);
  });
  const disableEffect = Signal.effect(effect);
  disableEffect();
  signal.value = 200;
  expect(signal.value).toBe(200);
  assertSpyCalls(effect, 1);
});

Deno.test('A computed signal effect function is called when a dependent signal changes', () => {
  const signal1 = new Signal(100);
  const computedSignal = Signal.computed(() => signal1.value ? signal1.value.toFixed(2) : '');
  expect(computedSignal.value).toBe('100.00');
  const effect = spy(() => {
    console.log('computed signal changed to =>', computedSignal.value);
  });
  Signal.effect(effect);
  signal1.value = 200;
  expect(computedSignal.value).toBe('200.00');
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
  source.value = 101;
  expect(computed1.value).toBe(false);
  expect(computed2.value).toBe(true);
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
  expect(computed.value).toBe(500);
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
  expect(computed1.value).toBe(1100);
  expect(computed2.value).toBe(1200);
  assertSpyCalls(effect, 2);
});

Deno.test('An explicit effect on Signal is executed effect when the source Observable changes', () => {
  const effect = spy();
  const signal = new Signal(10);
  signal.addEffect(effect);
  assertSpyCalls(effect, 1);
});

Deno.test('A Signal created from an Observable will execute effect when the source Observable changes', () => {
  const obs$ = new Subject(10);
  const signal = Signal.fromObservable(obs$);
  const effect = spy(() => {
    console.log('spy1 called', signal.value);
  });
  Signal.effect(effect);
  assertSpyCalls(effect, 1);
});
