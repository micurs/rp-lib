import React from 'react';

import type { Ticket } from '../types.ts';
import { getStatus } from '../state.ts';
import { setActive, transitionTo } from '../state-by-signals.ts';

interface TicketItemProps {
  ticket: Ticket;
}

const basteTicketClass = 'card cursor-pointer w-full text-primary-content m-1 p-2 rounded-xl max-w-md';

const ticketClass = (active: boolean) =>
  active ? `${basteTicketClass} bg-slate-400 shadow-lg shadow-black` : `${basteTicketClass} bg-slate-500`;

export const TicketItem = ({ ticket }: TicketItemProps) => {
  const handleTransition = (e: React.MouseEvent, step: number) => {
    transitionTo(ticket.id, getStatus(ticket.status, step));
    e.stopPropagation();
  };

  const handleActiveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setActive(ticket.id);
  };

  return (
    <div
      className={ticketClass(ticket.active)}
      onClick={handleActiveToggle}
      id={`${ticket.id}`}
    >
      <div className='card-body p-1'>
        <h2 className='card-title'>{ticket.title}</h2>
        <p>
          {ticket.description} (Active: {ticket.active ? 'Yes' : 'No'})
        </p>
        <div className='card-actions justify-end'>
          <button
            className='btn btn-circle btn-accent'
            onClick={(e) => handleTransition(e, -1)}
          >
            &laquo;
          </button>
          <button
            className='btn btn-circle btn-accent'
            onClick={(e) => handleTransition(e, +1)}
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};
