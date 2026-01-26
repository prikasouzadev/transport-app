import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Delivery } from 'src/app/interface/delivery.interface';
import { DeliveryService } from 'src/app/service/delivery.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {

  deliveries = signal<Delivery[]>([]);
  filtroStatus = signal<string>('Todos');

  // Relatório Filtrado
  reportData = computed(() => {
    const data = this.deliveries();
    if (this.filtroStatus() === 'Todos') return data;
    return data.filter(d => d.status === this.filtroStatus());
  });

  // Métricas de Performance
  metrics = computed(() => {
    const data = this.deliveries();
    const entregues = data.filter(d => d.status === 'Entregue').length;
    return {
      taxaSucesso: data.length > 0 ? (entregues / data.length) * 100 : 0,
      totalVolume: data.length,
      pendenciaCritica: data.filter(d => d.status === 'Pendente').length
    };
  });

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit() {
    this.deliveryService.getDeliveries().subscribe(data => this.deliveries.set(data));
  }

  exportFullPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Relatório Consolidado de Logística', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['ID', 'Cliente', 'Status', 'Data Envio', 'Destino']],
      body: this.reportData().map(d => [d.id, d.cliente, d.status, d.dataEnvio, d.endereco]),
      headStyles: { fillColor: [2, 16, 36] } // Cor #021024
    });

    doc.save('relatorio-logistica.pdf');
  }
}
