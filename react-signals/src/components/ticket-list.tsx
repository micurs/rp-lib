// import React from 'react';
import type { Ticket } from '../types.ts';
import { TicketItem } from './ticket-item.tsx';

import './ticket-list.css';

interface TicketListProps {
  tickets: Ticket[];
  label: string;
}

export const TicketList = ({ tickets, label }: TicketListProps) => {
  return (
    <>
      <h1 className="text-2xl mb-4 capitalize text-center bg-slate-800 w-full py-2">
        {label}
        <div className="badge badge-secondary badge-outline mx-2 h-6 w-6">{tickets!.length}</div>
      </h1>
      <ul className="list-disc list-inside flex flex-col items-center justify-start ticket-list">
        {tickets.map((t) => (
          <TicketItem key={t.id} ticket={t} />
        ))}
      </ul>
    </>
  );
};
