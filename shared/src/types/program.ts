export enum ProgramStatus {
  PLANNED = "PLANNED",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum ProgramCategory {
  SKILL_TRAINING = "SKILL_TRAINING",
  LEGAL_AID = "LEGAL_AID",
  HEALTH_CAMP = "HEALTH_CAMP",
  EDUCATION = "EDUCATION",
  RELIEF_DISTRIBUTION = "RELIEF_DISTRIBUTION",
  COMMUNITY_EMPOWERMENT = "COMMUNITY_EMPOWERMENT",
}

export interface Program {
  id: string;
  name: string;
  description: string;
  category: ProgramCategory;
  startDate: string | Date;
  endDate?: string | Date;
  status: ProgramStatus;
  targetBeneficiaries: number;
  actualBeneficiaries?: number;
  location: string;
  budget: number;
  imageUrl?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
