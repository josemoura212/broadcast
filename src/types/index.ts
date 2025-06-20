export interface Connection {
  id: string;
  name: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
}

export interface Message {
  id: string;
  content: string;
  status: "agendada" | "enviada";
  scheduledAt?: Date;
  sentAt?: Date;
  contactIds: string[];
}
