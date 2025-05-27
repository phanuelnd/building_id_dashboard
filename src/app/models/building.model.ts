export interface Building {
  id: string;
  buildingId: string;
  name: string;
  address: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  type: BuildingType;
  status: BuildingStatus;
  owner: string;
  constructionYear: number;
  area: number;
  floors: number;
  registrationDate: Date;
  lastInspection?: Date;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export enum BuildingType {
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial',
  INDUSTRIAL = 'Industrial',
  INSTITUTIONAL = 'Institutional',
  MIXED_USE = 'Mixed Use'
}

export enum BuildingStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  SUSPENDED = 'Suspended',
  DEMOLISHED = 'Demolished'
}

export interface BuildingFilter {
  search?: string;
  district?: string;
  type?: BuildingType;
  status?: BuildingStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface DashboardStats {
  totalBuildings: number;
  activeBuildings: number;
  pendingBuildings: number;
  newThisMonth: number;
  inspectionsDue: number;
} 