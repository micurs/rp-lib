import './App.css';
import React from 'react';
import { Signal } from '@micurs/rp-lib';

import { TicketList } from './components/ticket-list.tsx';
import { tickets$ } from './state-by-signals.ts';

const ticketListState = 'flex-1 min-w-fit max-w-lg w-1/3 border-r-[1px] border-slate-600 flex flex-col items-center align-top';

/**
 * Simple custom hook that can be used to integrate react with rp-lib Signal class.
 * @param signal$ - The signal to subscribe to.
 * @param def - The default value to return if the signal has not yet emitted a value.
 * @returns a value as emitted by the signal or the default value if the signal has not yet emitted a value.
 */
function useSignal<M>(signal$: Signal<M>, def: NonNullable<M>) {
  const [, setState] = React.useState({});
  React.useEffect(() => {
    const clearEffect = signal$.addEffect(() => setState({}));
    return () => clearEffect();
  }, [signal$]);
  return signal$.value ?? def;
}

function App() {
  const tickets = useSignal(tickets$, []);

  return (
    <>
      <div className="flex flex-row flex-1 align-top w-full border-slate-500">
        <div className={ticketListState}>
          <TicketList label="To Do" tickets={tickets.filter((ticket) => ticket.status === 'todo')} />
        </div>
        <div className={ticketListState}>
          <TicketList label="In Progress" tickets={tickets.filter((ticket) => ticket.status === 'inProgress')} />
        </div>
        <div className={ticketListState}>
          <TicketList label="Done" tickets={tickets.filter((ticket) => ticket.status === 'done')} />
        </div>
      </div>
    </>
  );
}

export default App;
