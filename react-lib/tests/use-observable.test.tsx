/// <reference lib="deno.ns" />
import { expect } from 'jsr:@std/expect';

import 'global-jsdom/register';
import { render, waitFor, configure } from '@testing-library/react';

import { Subject } from 'jsr:@micurs/rp-lib';
import { useObservable } from '../src/index.ts';

configure({reactStrictMode: false});

Deno.test('useObservable should return the current value of the observable', () => {
  const obs$ = new Subject(42);
  const TestComponent = () => {
    const result = useObservable(obs$);
    return <span>{result}</span>;
  };

  const { container } = render(<TestComponent />);
  expect(container.innerHTML).toBe('<span>42</span>');
});


Deno.test('useObservable should re-render when emitting a new value on the observable', async () => {
  const obs$ = new Subject(42);
  const TestComponent = () => {
    const result = useObservable(obs$);
    return <span>{result}</span>;
  };

  const { container } = render(<TestComponent />);

  obs$.emit(99);

  // Wait for the DOM to reflect the new emitted value
  await waitFor(() => {
    expect(container.innerHTML).toBe('<span>99</span>');
  });
});

Deno.test('useObservable should re-render once when the observable emit one more value', async () => {
  const obs$ = new Subject(42);
  const renderCount = { count: 0 };

  const TestComponent = () => {
    renderCount.count += 1;
    const result = useObservable(obs$);
    return <span>{result}</span>;
  };

  const { container } = render(<TestComponent />);

  // Initial render
  expect(renderCount.count).toBe(1);

  // Emit a new value
  obs$.emit(99);

  // Wait for the DOM to reflect the new emitted value
  await waitFor(() => {
    expect(container.innerHTML).toBe('<span>99</span>');
  });

  // Verify the component re-rendered exactly once
  expect(renderCount.count).toBe(2);
});

