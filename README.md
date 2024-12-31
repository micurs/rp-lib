[![https://jsr.io/@micurs/rp-lib](https://jsr.io/badges/@micurs/rp-lib)](https://jsr.io/@micurs/rp-lib)
[![license:mit](https://img.shields.io/badge/license-MIT-black.svg)](https://opensource.org/licenses/mit)
![Silicon Villas - Education](https://img.shields.io/badge/Silicon_Villas-Education-blue.svg)

# A Reactive Programming library in TypeScript

This repository is a Deno monorepo containing a simple reactive programming library written in TypeScript. It serves as a tutorial for a course on Reactive Programming.

## Library Overview

The core library is located in the [`lib`](./lib) folder and includes:

- **Subject**: A basic implementation of an Observable.
- **Operators**: A collection of operators to transform data emitted by the `Subject`.
- **Signal**: A lightweight implementation built on top of the `Subject`, demonstrating the close relationship between these two constructs.

## React Integration

Additionally, the repository contains a secondary library in the [`react-lib`](./react-lib) folder. This library provides:

- React hooks for connecting React components with `Subject` and `Signal`.

## CLI Demo

The `demos/cli-demo` folder contains a simple CLI demo that demonstrates the core functionality of the library.
You can run each file individually using the `deno` command. For example:

```
deno run demos/cli-demo/concat-map.ts
```

Or you can run the `cli-demo` task to run all the demos:

```
deno task cli-demo
```

## React Demo

The `demos/react-signal` folder contains a simple React demo that demonstrates how to use the `useSignal` and `useSubject` hooks in a React application.

You can run the demo using the `deno` command:

```
deno task react-demo
```

## Tests

To run all the unit tests use the following command:

```
deno task test
```

## License

License: MIT
