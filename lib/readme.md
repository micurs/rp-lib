# A TypeScript Reactive Programming library

This project is a TypeScript library for reactive programming.

It serves as a tutorial for a course on Reactive Programming.

It includes:

- **Subject**: A basic implementation of an Observable.
- **Operators**: A collection of operators to transform data emitted by the `Subject`.
- **Signal**: A lightweight implementation built on top of the `Subject`, demonstrating the close relationship between these two constructs.

## Usage

The library is available as a Deno module and published in the jsr registry.

### With Deno

```
deno add @micurs/rp-lib
```

### With npm

```
npx jsr add @micurs/rp-lib
yarn dlx jsr add @micurs/rp-lib
pnpm dlx jsr add @micurs/rp-lib
bunx jsr add @micurs/rp-lib
```

### In your code

You can then use the exported functions in your code.

```typescript
import { Subject } from '@micurs/rp-lib';

const subject$ = new Subject<number>(10);

subject$.subscribe((value) => {
  console.log(value);
});
```

## License

License: MIT
