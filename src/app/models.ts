export interface ServiceDescription {
  id: number;
  title: string;
  item: string;
}

export interface Service {
  id: number;
  title: string;
  subhead: string;
  imageUrl: string;
  descriptions: ServiceDescription[];
}

export interface GalleryItem {
  id: number;
  beforeImageUrl: string;
  afterImageUrl: string;
}

export interface ServiceCreateInput {
  title: string;
  subhead: string;
  image?: File;
  descriptionIds: number[];
}

export interface AvailabilitySlot {
  id: number;
  startUtc: string; // ISO‐string
  endUtc: string; // ISO‐string
}

export interface BookingRequest {
  name: string;
  email: string;
  phone?: string;
  services: string[]; // e.g. ["ombré-powder-brows"]
  startUtc: string; // ISO‐string
  endUtc: string; // ISO‐string
  message: string;
}

export interface BookingResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  services: string[];
  startUtc: string;
  endUtc: string;
  googleEventId?: string;
  createdUtc: string;
}

export interface Contact {
  name: string;
  email: string;
  subject: string;
  msg: string;
  phone: string;
}

interface DailyAvailability {
  day: string; // 'Monday', 'Tuesday', etc.
  available: boolean;
  startTime: string; // '09:00'
  endTime: string; // '17:00'
}
