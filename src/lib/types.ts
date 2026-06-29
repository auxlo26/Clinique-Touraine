export interface Booking {
  reference: string;
  service: string;
  animal: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  name: string;
  phone: string;
  email: string;
  notes?: string;
  consent: true;
  createdAt: string;
}

export interface CallbackRequest {
  reference: string;
  name: string;
  phone: string;
  reason: string;
  isEmergency: boolean;
  createdAt: string;
}
