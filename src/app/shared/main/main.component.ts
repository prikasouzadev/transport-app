import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeliveryService } from 'src/app/service/delivery.service';
import { Delivery } from 'src/app/interface/delivery.interface';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  tabs = [
    { label: 'Entregas', route: '/delivery-list'},
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Relatórios', route: '/report' }
  ];

  allDeliveries = signal<Delivery[]>([]);

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit() {
    this.loadAllDeliveries();
  }

  loadAllDeliveries() {
    this.deliveryService.getDeliveries().subscribe({
      next: (data) => {
        // Atualiza o signal central
        this.allDeliveries.set(data);
        console.log('Base de dados sincronizada:', data.length, 'itens');
      },
      error: (err) => console.error('Falha na sincronização:', err)
    });
  }
}
