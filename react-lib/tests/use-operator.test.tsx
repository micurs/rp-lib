import { expect } from 'jsr:@std/expect';

import 'global-jsdom/register';
import { configure, fireEvent, render, waitFor } from '@testing-library/react';

import { map } from 'jsr:@micurs/rp-lib';
import { useOperator } from '../src/index.ts';

configure({ reactStrictMode: false });

Deno.test('useOperator should return the current values of the observables', () => {
  const initialValue = 42;
  let renderCount = 0;
  const operator = map((v: number) => v * 2);
  const TestComponent = () => {
    const [sourceValue, outValue, _] = useOperator(initialValue, operator);
    renderCount++;
    return <span>{sourceValue},{outValue}</span>;
  };

  const { container } = render(<TestComponent />);
  expect(container.innerHTML).toBe('<span>42,84</span>');
  // We expect to renderings. The second is the one with the outValue set.
  expect(renderCount).toBe(2);
});

Deno.test('useOperator should rerender when the setter function is called', async () => {
  let renderCount = 0;
  const initialValue = 42;
  const operator = map((v: number) => v * 2);
  const TestComponent = () => {
    const [sourceVal, outValue, setSource] = useOperator<number, number>(initialValue, operator);
    const handleClick = () => setSource(10);
    renderCount++;
    return (
      <>
        <span>{sourceVal},{outValue}</span>
        <button onClick={handleClick}>Emit</button>
      </>
    );
  };

  const { container, getByText } = render(<TestComponent />);

  // We expect to renderings. The second is the one with the outValue set.
  expect(renderCount).toBe(2);
  expect(container.innerHTML).toContain('<span>42,84</span>');

  // Locate and click the button
  const button = getByText('Emit');
  fireEvent.click(button);

  // Wait for the DOM to reflect the new emitted value
  await waitFor(() => {
    expect(container.innerHTML).toContain('<span>10,20</span>');
  });
  // One more rendering since the source inner observable was changed.
  expect(renderCount).toBe(3);
});
