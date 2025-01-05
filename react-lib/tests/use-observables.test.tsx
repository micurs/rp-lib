/// <reference lib="deno.ns" />
import { expect } from 'jsr:@std/expect';
import 'global-jsdom/register';
import { configure, render, waitFor } from '@testing-library/react';

import { useObservables } from '../src/index.ts';
import { Subject } from '../../lib/src/index.ts';

configure({ reactStrictMode: false });

Deno.test('useObservables allow to react to two Observers.', () => {
  let renderCount = 0;
  const obs1$ = new Subject(10);
  const obs2$ = new Subject(20);
  const TestComponent = () => {
    renderCount += 1;
    const [result1, result2] = useObservables([obs1$, obs2$]);
    return <span>{result1},{result2}</span>;
  };
  const { container } = render(<TestComponent />);

  expect(container.innerHTML).toBe('<span>10,20</span>');
  expect(renderCount).toBe(1);
});

Deno.test('useObservables should re-render when emitting a new value on any observable passed', async () => {
  let renderCount = 0;
  const obs1$ = new Subject('test');
  const obs2$ = new Subject('this');
  const obs3$ = new Subject('code');
  const TestComponent = () => {
    renderCount += 1;
    const [result1, result2, result3] = useObservables([obs1$, obs2$, obs3$]);
    return <span>{result1} {result2} {result3}</span>;
  };
  const { container } = render(<TestComponent />);
  expect(container.innerHTML).toBe('<span>test this code</span>');
  expect(renderCount).toBe(1);

  obs3$.emit('component');

  await waitFor(() => {
    expect(renderCount).toBe(2);
    expect(container.innerHTML).toBe('<span>test this component</span>');
  });
});
