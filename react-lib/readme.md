# Introduction

A simple library to integrate [`@micurs/rp-lib`](https://jsr.io/@micurs/rp-lib)
with React.

This library has been developed as a tutorial for a course on Reactive
Programming. This is not intended to be a production-ready library.

## Usage

The library provides a set of hooks to interact with the `rp-lib` library
`Subject` and `Signal`.

### Observer hook

```tsx
import { Subject } from "@micurs/rp-lib";
import { useObservable } from "@micurs/react-rp-lib";

const counter$ = new Subject<number>(1);

// This component will re-render every time the counter changes
const counterComponent = () => {
  const counter = useObservable(counter$);
  return <div>{counter}</div>;
};
```

### Signal hook

```tsx
import { Signal } from "@micurs/rp-lib";
import { useSignal } from "@micurs/react-rp-lib";

const signal = new Signal(10);

// This component will re-render every time the signal is emitted
const signalComponent = () => {
  const value = useSignal(signal);
  return <div>{value}</div>;
};
```

## License

License: MIT
