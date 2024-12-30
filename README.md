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

The `cli-demo` folder contains a simple CLI demo that demonstrates the core functionality of the library.

## Build and run tests and demos

This project runs on `deno`, so no need to build anything before running the code.

To run the CLI demo:

```
deno task cli-demo
```

To run the unit tests:

```
deno task test
```

## License

License: MIT
