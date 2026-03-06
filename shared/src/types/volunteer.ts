export enum VolunteerAvailability {
  WEEKDAYS = "WEEKDAYS",
  WEEKENDS = "WEEKENDS",
  EVENINGS = "EVENINGS",
  FLEXIBLE = "FLEXIBLE",
}

export enum VolunteerStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  interests: string[];
  availability: VolunteerAvailability;
  joinedDate: string | Date;
  status: VolunteerStatus;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
