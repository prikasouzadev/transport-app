import { Component, computed, ElementRef, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Delivery } from 'src/app/interface/delivery.interface';
import { DeliveryService } from 'src/app/service/delivery.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  @ViewChild('statusChart') statusChartCanvas!: ElementRef;

  deliveries = signal<Delivery[]>([]);

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit() {
    this.deliveryService.getDeliveries().subscribe(data => {
      this.deliveries.set(data);
      setTimeout(() => this.createChart(), 100)
    });
  }

  // Calculo das estatísticas de entregas
  stats = computed(() => {
    const data = this.deliveries();
    const hoje = new Date().toISOString().split('T')[0];

    return {
      total: data.length,
      pendentes: data.filter(d => d.status === 'Pendente').length,
      emRota: data.filter(d => d.status === 'Em Rota').length,
      entregues: data.filter(d => d.status === 'Entregue').length,
      canceladas: data.filter(d => d.status === 'Cancelada').length,
      novas: data.filter(d => d.dataEnvio.includes(hoje)).length
      // novas: data.filter(d => d.dataEnvio.includes('2026-01-26')).length
    };
  });


    createChart() {
    const s = this.stats();
    new Chart(this.statusChartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Pendentes', 'Em Rota', 'Entregues', 'Canceladas'],
        datasets: [{
          data: [s.pendentes, s.emRota, s.entregues, s.canceladas],
          backgroundColor: ['#fef08a', '#bfdbfe', '#bbf7d0', '#fecaca'],
          hoverBackgroundColor: ['#facc15', '#60a5fa', '#4ade80', '#f87171'],
          borderWidth: 0,
          // cutout: '80%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }
}
