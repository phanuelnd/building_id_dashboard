import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Building, BuildingType, BuildingStatus, BuildingFilter, DashboardStats } from '../models/building.model';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private readonly mockBuildings: Building[] = [
    {
      id: '1',
      buildingId: 'RW-KGL-001',
      name: 'Kigali City Tower',
      address: 'KN 4 Ave, Kigali',
      district: 'Gasabo',
      sector: 'Kacyiru',
      cell: 'Kamatamu',
      village: 'Kamatamu',
      type: BuildingType.COMMERCIAL,
      status: BuildingStatus.ACTIVE,
      owner: 'Rwanda Development Board',
      constructionYear: 2018,
      area: 15000,
      floors: 12,
      registrationDate: new Date('2018-06-15'),
      lastInspection: new Date('2024-01-15'),
      coordinates: { latitude: -1.9441, longitude: 30.0619 }
    },
    {
      id: '2',
      buildingId: 'RW-KGL-002',
      name: 'Green Hills Academy',
      address: 'Nyarutarama, Kigali',
      district: 'Gasabo',
      sector: 'Remera',
      cell: 'Nyarutarama',
      village: 'Nyarutarama',
      type: BuildingType.INSTITUTIONAL,
      status: BuildingStatus.ACTIVE,
      owner: 'Green Hills Academy Ltd',
      constructionYear: 2009,
      area: 8500,
      floors: 3,
      registrationDate: new Date('2009-03-20'),
      lastInspection: new Date('2024-02-10')
    },
    {
      id: '3',
      buildingId: 'RW-MSZ-001',
      name: 'Musanze Industrial Complex',
      address: 'Musanze City',
      district: 'Musanze',
      sector: 'Muhoza',
      cell: 'Rwaza',
      village: 'Cyuve',
      type: BuildingType.INDUSTRIAL,
      status: BuildingStatus.PENDING,
      owner: 'Industrial Development Corp',
      constructionYear: 2023,
      area: 25000,
      floors: 2,
      registrationDate: new Date('2024-01-10')
    },
    {
      id: '4',
      buildingId: 'RW-KGL-003',
      name: 'Kigali Heights Residential',
      address: 'Kimihurura, Kigali',
      district: 'Gasabo',
      sector: 'Kimihurura',
      cell: 'Kimihurura',
      village: 'Ubumwe',
      type: BuildingType.RESIDENTIAL,
      status: BuildingStatus.ACTIVE,
      owner: 'Horizon Construction Ltd',
      constructionYear: 2020,
      area: 12000,
      floors: 8,
      registrationDate: new Date('2020-11-05'),
      lastInspection: new Date('2023-12-20')
    },
    {
      id: '5',
      buildingId: 'RW-HYE-001',
      name: 'Huye University Campus',
      address: 'Huye District',
      district: 'Huye',
      sector: 'Tumba',
      cell: 'Tumba',
      village: 'Tumba',
      type: BuildingType.INSTITUTIONAL,
      status: BuildingStatus.ACTIVE,
      owner: 'University of Rwanda',
      constructionYear: 2015,
      area: 18000,
      floors: 4,
      registrationDate: new Date('2015-08-30'),
      lastInspection: new Date('2024-01-05')
    }
  ];

  private buildingsSubject = new BehaviorSubject<Building[]>(this.mockBuildings);
  buildings$ = this.buildingsSubject.asObservable();

  getBuildings(filter?: BuildingFilter): Observable<Building[]> {
    let filteredBuildings = [...this.mockBuildings];

    if (filter) {
      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        filteredBuildings = filteredBuildings.filter(building =>
          building.name.toLowerCase().includes(searchTerm) ||
          building.buildingId.toLowerCase().includes(searchTerm) ||
          building.address.toLowerCase().includes(searchTerm) ||
          building.owner.toLowerCase().includes(searchTerm)
        );
      }

      if (filter.district) {
        filteredBuildings = filteredBuildings.filter(building =>
          building.district === filter.district
        );
      }

      if (filter.type) {
        filteredBuildings = filteredBuildings.filter(building =>
          building.type === filter.type
        );
      }

      if (filter.status) {
        filteredBuildings = filteredBuildings.filter(building =>
          building.status === filter.status
        );
      }
    }

    return of(filteredBuildings).pipe(delay(300)); // Simulate API delay
  }

  getBuildingById(id: string): Observable<Building | undefined> {
    const building = this.mockBuildings.find(b => b.id === id);
    return of(building).pipe(delay(200));
  }

  getDashboardStats(): Observable<DashboardStats> {
    const stats: DashboardStats = {
      totalBuildings: this.mockBuildings.length,
      activeBuildings: this.mockBuildings.filter(b => b.status === BuildingStatus.ACTIVE).length,
      pendingBuildings: this.mockBuildings.filter(b => b.status === BuildingStatus.PENDING).length,
      newThisMonth: this.mockBuildings.filter(b => {
        const now = new Date();
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return b.registrationDate >= monthAgo;
      }).length,
      inspectionsDue: this.mockBuildings.filter(b => {
        if (!b.lastInspection) return true;
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        return b.lastInspection <= oneYearAgo;
      }).length
    };

    return of(stats).pipe(delay(200));
  }

  getDistricts(): Observable<string[]> {
    const districts = [...new Set(this.mockBuildings.map(b => b.district))].sort();
    return of(districts);
  }

  updateBuilding(building: Building): Observable<Building> {
    const index = this.mockBuildings.findIndex(b => b.id === building.id);
    if (index !== -1) {
      this.mockBuildings[index] = building;
      this.buildingsSubject.next([...this.mockBuildings]);
    }
    return of(building).pipe(delay(500));
  }
} 