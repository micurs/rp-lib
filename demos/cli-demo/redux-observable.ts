import { debounce, dedupe, map, pipe, Subject, tap } from '@micurs/rp-lib';
import type { Observable } from '@micurs/rp-lib';

// Types
// ----------------------------------------------------------------------------

type Action<T> = {
  type: T;
  payload: unknown;
};

// Our rp-lib Redux implementation
// ----------------------------------------------------------------------------

type Reducer<ActionsTypes, Store> = (store: Store, action: Action<ActionsTypes>) => Store;

type Selector<Store, SubStore> = (store: Store) => SubStore;

/**
 * Combines multiple reducers into a single reducer.
 * @param reducers - an array of reducers to combine
 * @returns a single reducer that applies each of the input reducers in sequence
 */
const combineReducers = <ActionsTypes, Store>(reducers: Reducer<ActionsTypes, Store>[]) => {
  return (inputState: Store, action: Action<ActionsTypes>) =>
    reducers.reduce((acc, reducer) => reducer(acc, action), inputState);
};

/**
 * A simple Redux implementation as a reactive operator.
 * @param initialState - the initial state of the store
 * @param reducer - the reducer function that updates the store based on actions
 * @returns the operator that converts actions into state transitions
 */
const redux = <ActionsTypes, Store>(initialState: Store, reducer: Reducer<ActionsTypes, Store>) => {
  let state: Store = { ...initialState };
  return (source$: Observable<Action<ActionsTypes>>): Observable<Store> => {
    const result$ = new Subject<Store>((store$) => {
      source$.subscribe({
        next: (action) => {
          state = reducer(state, action);
          store$.emit(state);
        },
      });
    });
    return result$;
  };
};

/**
 * Creates an observable that emits only when the selected subsection of the store changes.
 * @param selFn - a function that extracts the subsection from the store
 * @returns the observable that emits only when the subsection changes
 */
const selectFromStore = <Store, SubStore>(selFn: Selector<Store, SubStore>) =>
  pipe(
    map(selFn), // Extract the counter from the store
    dedupe(), // It will only emit a value if it is different from the previous one
  );

// ----------------------------------------------------------------------------

type MyActions = 'INCREMENT' | 'DECREMENT' | 'SET-STATE';
type MyStore = { counter: number; state: string | undefined };

const increment: Action<MyActions> = { type: 'INCREMENT', payload: 1 };
const decrement: Action<MyActions> = { type: 'DECREMENT', payload: 1 };
const setInitialState: Action<MyActions> = { type: 'SET-STATE', payload: 'START' };
const setFinalState: Action<MyActions> = { type: 'SET-STATE', payload: 'END' };
const setState = (s: string): Action<MyActions> => ({ type: 'SET-STATE', payload: s });

const initialState: MyStore = { counter: 0, state: undefined };

// Here are our simple reducers.
// ----------------------------------------------------------------------------

const countReducer = (state: MyStore = initialState, action: Action<MyActions>): MyStore => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + (action.payload as number) };
    case 'DECREMENT':
      return { ...state, counter: state.counter - (action.payload as number) };
    default:
      return state;
  }
};

const stateReducer = (state: MyStore = initialState, action: Action<MyActions>): MyStore => {
  switch (action.type) {
    case 'SET-STATE':
      return { ...state, state: action.payload as string };
    default:
      return state;
  }
};

const reducer = combineReducers([countReducer, stateReducer]);

const actionObservable$ = new Subject<Action<MyActions>>();

// Let's create the store observable using our redux operator.
const store$ = redux(initialState, reducer)(actionObservable$);

// const store$ = pipe(
//   tap<Action<MyActions>>((action) => console.log('Action', action)),
//   redux(initialState, reducer),
//   debounce(500), // Debounce the store updates to avoid too frequent emissions
// )(actionObservable$);

/**
 * Create an observable on a subsection of the store. The result will emit
 * only, and only when the subsection (the counter) changes.
 */
const storeCounter$ = selectFromStore((store: MyStore) => store.counter)(store$);

// Let's subscribe to the store and the counter observable
store$
  .subscribe({
    next: (state) => console.log('\tState: ', state),
  });
storeCounter$.subscribe({
  next: (counter) => console.log('\tCounter: ', counter),
});

// Let's emit some actions to see how the store changes
// ----------------------------------------------------------------------------
actionObservable$.emit(setInitialState);
actionObservable$.emit(increment);
actionObservable$.emit(increment);
actionObservable$.emit(setState('MIDDLE1'));
actionObservable$.emit(setState('MIDDLE2'));
actionObservable$.emit(decrement);
actionObservable$.emit(increment);
actionObservable$.emit(decrement);
actionObservable$.emit(setFinalState);
