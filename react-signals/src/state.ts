import { Status, Ticket, statusMap } from './types';

const ticketStatuses: Status[] = ['todo', 'inProgress', 'done'];

interface TicketsState {
  tickets: Ticket[];
  selectedTicketId: number | null;
}

export const initialState: TicketsState = {
  tickets: [
    { id: 1, title: 'First ticket', description: 'This is the first ticket', status: 'todo', active: true },
    { id: 2, title: 'Second ticket', description: 'This is the second ticket', status: 'todo', active: false },
    { id: 3, title: 'Third ticket', description: 'This is the third ticket', status: 'todo', active: false },
  ],
  selectedTicketId: null,
};

/**
 * Compute the next status of a ticket based on the current status and a step
 * @param status - the current status of the ticket
 * @param step - the step to apply to the current status
 * @returns a new status
 */
export const getStatus = (status: Status, step: number = 0) => {
  const newStatusIndex = statusMap[status] + step;
  if (newStatusIndex < 0 || newStatusIndex >= ticketStatuses.length) {
    return status;
  }
  return ticketStatuses[newStatusIndex];
};
