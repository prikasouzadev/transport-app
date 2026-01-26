import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'delivery-list',
    loadComponent: () => import('./component/delivery-list/delivery-list.component').then(m => m.DeliveryListComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./component/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'new-delivery',
    loadComponent: () => import('./component/new-delivery/new-delivery.component').then(m => m.NewDeliveryComponent)
  },
  {
    path: 'delivery-detail/:id',
    loadComponent: () => import('./component/delivery-details/delivery-details.component').then(m => m.DeliveryDetailsComponent)
  },
  {
    path: 'report',
    loadComponent: () => import('./component/report/report.component').then(m => m.ReportComponent)
  },
];
