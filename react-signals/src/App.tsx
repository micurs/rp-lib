import './App.css';
// import * as React from 'react';
// import type { Signal } from '@micurs/rp-lib';
import { useSignal } from '@micurs/react-rp-lib';

import { TicketList } from './components/ticket-list.tsx';
import { tickets$ } from './state-by-signals.ts';

const ticketListState = 'flex-1 min-w-fit max-w-lg w-1/3 border-r-[1px] border-slate-600 flex flex-col items-center align-top';

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
