import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  tabs = [
    { label: 'Entregas', route: '/list' },
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Relatórios', route: '/report' }
  ];
}
