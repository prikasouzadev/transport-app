import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from 'src/app/service/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public sidebarService: SidebarService) {}
}
