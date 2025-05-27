import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
      <app-sidebar [isOpen]="sidebarOpen"></app-sidebar>
      
      <!-- Main content -->
      <div class="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <!-- Navbar -->
        <app-navbar (sidebarToggle)="toggleSidebar()"></app-navbar>
        
        <!-- Page content -->
        <main class="flex-1 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AppComponent {
  title = 'building-id-dashboard';
  sidebarOpen = false;

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
