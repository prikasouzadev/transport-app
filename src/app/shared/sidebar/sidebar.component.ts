import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'fa-solid fa-square' },
    { label: 'Nova Entrega', route: '/new-delivery', icon: 'fa-solid fa-shield-blank' },
    { label: 'Entregas', route: '/delivery-list', icon: 'fa-solid fa-bars-staggered' },
    { label: 'Relatórios', route: '/report', icon: 'fa-solid fa-chart-simple' }
  ];

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenuMobile() {
    if (window.innerWidth < 768) {
      this.isMenuOpen = false;
    }
  }
}
