import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BuildingService } from '../../services/building.service';
import { Building, BuildingType, BuildingStatus, BuildingFilter } from '../../models/building.model';

@Component({
  selector: 'app-buildings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-6">
      <!-- Page header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Buildings Registry</h1>
          <p class="text-gray-600">Manage and view all registered buildings</p>
        </div>
        <button class="btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Building
        </button>
      </div>

      <!-- Search and filters -->
      <div class="card p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearchChange($event)"
                placeholder="Search by name, ID, address, or owner..."
                class="form-input pl-10"
              />
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- District filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">District</label>
            <select 
              [(ngModel)]="selectedDistrict"
              (ngModelChange)="onFilterChange()"
              class="form-input"
            >
              <option value="">All Districts</option>
              <option *ngFor="let district of districts$ | async" [value]="district">{{ district }}</option>
            </select>
          </div>

          <!-- Status filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select 
              [(ngModel)]="selectedStatus"
              (ngModelChange)="onFilterChange()"
              class="form-input"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
              <option value="Demolished">Demolished</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Buildings table -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200" *ngIf="buildings$ | async as buildings">
              <tr *ngFor="let building of buildings" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ building.name }}</div>
                      <div class="text-sm text-gray-500">{{ building.buildingId }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ building.address }}</div>
                  <div class="text-sm text-gray-500">{{ building.district }}, {{ building.sector }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {{ building.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" [class]="getStatusClass(building.status)">
                    {{ building.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ building.owner }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ building.registrationDate | date:'shortDate' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    (click)="viewBuilding(building)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </button>
                  <button class="text-gray-600 hover:text-gray-900">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty state -->
        <div *ngIf="(buildings$ | async)?.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No buildings found</h3>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      </div>
    </div>

    <!-- Building detail modal -->
    <div *ngIf="selectedBuilding" class="fixed inset-0 z-50 overflow-y-auto" (click)="closeModal()">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div 
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
          (click)="$event.stopPropagation()"
        >
          <!-- Modal header -->
          <div class="bg-white px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Building Details</h3>
              <button 
                (click)="closeModal()"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal content -->
          <div class="bg-white px-6 py-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Basic Information -->
              <div class="space-y-4">
                <h4 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Basic Information</h4>
                
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Building Name</label>
                    <p class="mt-1 text-sm text-gray-900">{{ selectedBuilding.name }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Building ID</label>
                    <p class="mt-1 text-sm text-gray-900 font-mono">{{ selectedBuilding.buildingId }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Type</label>
                    <span class="mt-1 inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {{ selectedBuilding.type }}
                    </span>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <span class="mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full" [class]="getStatusClass(selectedBuilding.status)">
                      {{ selectedBuilding.status }}
                    </span>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Owner</label>
                    <p class="mt-1 text-sm text-gray-900">{{ selectedBuilding.owner }}</p>
                  </div>
                </div>
              </div>

              <!-- Location & Details -->
              <div class="space-y-4">
                <h4 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Location & Details</h4>
                
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Address</label>
                    <p class="mt-1 text-sm text-gray-900">{{ selectedBuilding.address }}</p>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">District</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedBuilding.district }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Sector</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedBuilding.sector }}</p>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Cell</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedBuilding.cell }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Village</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedBuilding.village }}</p>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Construction Year</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedBuilding.constructionYear }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Area (m²)</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedBuilding.area | number }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Floors</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedBuilding.floors }}</p>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Registration Date</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedBuilding.registrationDate | date:'mediumDate' }}</p>
                    </div>
                    <div *ngIf="selectedBuilding.lastInspection">
                      <label class="block text-sm font-medium text-gray-700">Last Inspection</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedBuilding.lastInspection | date:'mediumDate' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
            <button 
              (click)="closeModal()"
              class="btn-secondary"
            >
              Close
            </button>
            <button class="btn-primary">
              Edit Building
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BuildingsComponent implements OnInit {
  buildings$!: Observable<Building[]>;
  districts$!: Observable<string[]>;
  
  searchTerm = '';
  selectedDistrict = '';
  selectedStatus = '';
  selectedBuilding: Building | null = null;
  
  private searchSubject = new BehaviorSubject<string>('');
  private filterSubject = new BehaviorSubject<BuildingFilter>({});

  constructor(private buildingService: BuildingService) {}

  ngOnInit(): void {
    this.districts$ = this.buildingService.getDistricts();
    
    this.buildings$ = combineLatest([
      this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.filterSubject
    ]).pipe(
      switchMap(([search, filter]) => {
        const combinedFilter: BuildingFilter = {
          ...filter,
          search: search || undefined
        };
        return this.buildingService.getBuildings(combinedFilter);
      })
    );
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  onFilterChange(): void {
    const filter: BuildingFilter = {};
    
    if (this.selectedDistrict) {
      filter.district = this.selectedDistrict;
    }
    
    if (this.selectedStatus) {
      filter.status = this.selectedStatus as BuildingStatus;
    }
    
    this.filterSubject.next(filter);
  }

  viewBuilding(building: Building): void {
    this.selectedBuilding = building;
  }

  closeModal(): void {
    this.selectedBuilding = null;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      case 'Demolished':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
} 