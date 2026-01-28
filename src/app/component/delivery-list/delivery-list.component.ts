import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Delivery } from 'src/app/interface/delivery.interface';
import { DeliveryDetailsComponent } from '../delivery-details/delivery-details.component';
import { DeliveryService } from 'src/app/service/delivery.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DeliveryDetailsComponent],
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css']
})
export class DeliveryListComponent {

  deliveries = signal<Delivery[]>([]); //armazenar as entregas
  searchTerm = signal('');
  filterStatus = signal('');
  currentPage = signal(1); //a pagina atual
  pageSize = 7;

  // Modal State
  isModalOpen = signal(false);
  selectedDelivery = signal<Delivery | null>(null);

  ngOnInit() {
    this.loadDeliveries();
  }

   loadDeliveries() {
    this.deliveryService.getDeliveries().subscribe(data => this.deliveries.set(data));
  }

  // Dados Filtrados
  filteredData = computed(() => {
    const filtered = this.deliveries().filter(d => {
    const matchSearch = d.cliente.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
                        d.id.toString().includes(this.searchTerm());
    const matchStatus = this.filterStatus() ? d.status === this.filterStatus() : true;
    return matchSearch && matchStatus;
  });

  return filtered.sort((a, b) => Number(b.id) - Number(a.id));
  // return filtered.sort((a, b) => b.id - a.id);
});

  // Paginação
  paginatedData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredData().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filteredData().length / this.pageSize));

  constructor(private deliveryService: DeliveryService) {}

  openDetails(delivery: Delivery) {
    this.selectedDelivery.set(delivery);
    this.isModalOpen.set(true);
  }

  getStatusClass(status: string) {
    const base = 'px-3 py-1 rounded-full text-xs font-bold ';
    switch (status) {
      case 'Pendente': return base + 'bg-yellow-100 text-yellow-700';
      case 'Em Rota': return base + 'bg-blue-100 text-blue-700';
      case 'Entregue': return base + 'bg-green-100 text-green-700';
      case 'Cancelada': return base + 'bg-red-100 text-red-700';
      default: return base + 'bg-gray-100 text-gray-700';
    }

  }

  exportToPDF() {
    const doc = new jsPDF();
    const dataParaExportar = this.filteredData();

    // Cabeçalho do PDF
    doc.setFontSize(18);
    doc.setTextColor(2, 16, 36); // Cor #021024 (brand-dark)
    doc.text('Relatório de Entregas - Truck Fast', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    const dataEmissao = new Date().toLocaleDateString('pt-BR');
    doc.text(`Emitido em: ${dataEmissao}`, 14, 28);

    // Mapeamento dos dados
    const rows = dataParaExportar.map(d => [
      `#${d.id}`,
      d.cliente,
      d.dataEnvio,
      d.status,
      d.produto,
      d.endereco.split('-')[1] || d.endereco
    ]);

    // Geração da Tabela
    autoTable(doc, {
      startY: 35,
      head: [['Pedido', 'Cliente', 'Envio', 'Status', 'Produto', 'Destino']],
      body: rows,
      headStyles: { fillColor: [5, 38, 89] }, // Cor #052659
      alternateRowStyles: { fillColor: [243, 246, 253] },
      styles: { fontSize: 8, cellPadding: 3 },
      margin: { top: 35 }
    });

    // Download do arquivo
    const nomeArquivo = `relatorio-entregas-${dataEmissao.replace(/\//g, '-')}.pdf`;
    doc.save(nomeArquivo);
  }
}

