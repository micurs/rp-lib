import { Signal } from '@micurs/rp-lib';
import { Status, Ticket } from './types.ts';
import { initialState } from './state.ts';

export const tickets$: Signal<Ticket[]> = new Signal(initialState.tickets);

/**
 * Change the status of a ticket
 * @param ticketId - the ID of the ticket to change
 * @param newStatus - the new status of the ticket
 */
export const transitionTo = (ticketId: number, newStatus: Status) => {
  tickets$.value = tickets$.value!.map((ticket) => {
    return ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket;
  });
};

export const setActive = (ticketId: number | null) => {
  tickets$.value = tickets$.value!.map((ticket) => {
    return ticket.id === ticketId ? { ...ticket, active: true } : { ...ticket, active: false };
  });
};
