import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside 
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0"
      [class.translate-x-0]="isOpen"
      [class.-translate-x-full]="!isOpen"
    >
      <!-- Sidebar header -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <span class="text-sm font-medium text-gray-900">Navigation</span>
        <button 
          class="lg:hidden p-1 rounded text-gray-600 hover:bg-gray-100"
          (click)="closeSidebar()"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation menu -->
      <nav class="flex-1 p-4 space-y-2">
        <div *ngFor="let item of navItems" class="relative">
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-blue-50 text-blue-700 border-blue-200"
            class="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-transparent"
          >
            <div class="flex items-center space-x-3">
              <div [innerHTML]="item.icon" class="w-5 h-5 flex-shrink-0"></div>
              <span>{{ item.label }}</span>
            </div>
            <span 
              *ngIf="item.badge" 
              class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full"
            >
              {{ item.badge }}
            </span>
          </a>
        </div>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-200">
        <div class="text-xs text-gray-500 space-y-1">
          <p>Building ID Registry v1.0</p>
          <p>© 2024 Republic of Rwanda</p>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div 
      *ngIf="isOpen" 
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      (click)="closeSidebar()"
    ></div>
  `
})
export class SidebarComponent {
  @Input() isOpen = false;

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v5a2 2 0 01-2 2H10a2 2 0 01-2-2V5z"></path>
      </svg>`,
      route: '/dashboard'
    },
    {
      label: 'Buildings',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>`,
      route: '/buildings'
    },
    {
      label: 'Registration',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>`,
      route: '/register'
    },
    {
      label: 'Inspections',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
      </svg>`,
      route: '/inspections',
      badge: 3
    },
    {
      label: 'Reports',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>`,
      route: '/reports'
    },
    {
      label: 'Settings',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>`,
      route: '/settings'
    }
  ];

  closeSidebar(): void {
    // This would typically emit an event to parent component
    // For now, we'll just handle it internally
  }
} 