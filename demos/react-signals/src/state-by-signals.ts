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
  const ticketMoving = tickets$.value!.find((ticket) => ticket.id === ticketId);
  if (ticketMoving) {
    // We move the ticket to the new status and put it at the end of the array
    tickets$.value = [
      ...tickets$.value!.filter((ticket) => ticket.id!== ticketId),
      { ...ticketMoving, status: newStatus }
    ]
  }
};

export const setActive = (ticketId: number | null) => {
  tickets$.value = tickets$.value!.map((ticket) => {
    return ticket.id === ticketId ? { ...ticket, active: true } : { ...ticket, active: false };
  });
};
