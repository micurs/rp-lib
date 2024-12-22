export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: Status;
  active: boolean;
}

export const statusMap = {
  todo: 0,
  inProgress: 1,
  done: 2,
}

export type Status = keyof typeof statusMap
