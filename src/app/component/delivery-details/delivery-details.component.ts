import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Delivery } from 'src/app/interface/delivery.interface';
import { DeliveryService } from 'src/app/service/delivery.service';

@Component({
  selector: 'app-delivery-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.css']
})
export class DeliveryDetailsComponent {
  @Input() delivery!: Delivery | null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  constructor(private deliveryService: DeliveryService) {}

  save() {
    if (this.delivery) {
      const novaMovimentacao = {
      data: new Date().toISOString().split('T')[0], // Gera "2026-01-26"
      status: this.delivery.status
    };

    this.delivery.historico = [...this.delivery.historico, novaMovimentacao];

    this.deliveryService.updateDelivery(this.delivery).subscribe({
      next: () => {
        this.saved.emit();
        this.close.emit();
      },
      error: (err) => console.error('Erro ao atualizar histórico:', err)
    });
    
    }
  }
}
