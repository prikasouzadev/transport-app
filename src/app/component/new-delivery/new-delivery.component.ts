import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DeliveryService } from 'src/app/service/delivery.service';

@Component({
  selector: 'app-new-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-delivery.component.html',
  styleUrls: ['./new-delivery.component.css']
})
export class NewDeliveryComponent {

  @Output() deliveryCreated = new EventEmitter<void>();

  deliveryForm!: FormGroup;

  showSuccessMsg = signal(false);

  constructor(private deliveryService: DeliveryService,
              private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.deliveryForm = this.fb.group({
      cliente: ['', [Validators.required, Validators.minLength(3)]],
      produto: ['', Validators.required],
      endereco: ['', Validators.required],
      dataEnvio: [new Date().toISOString().split('T')[0], Validators.required],
      // Validação de data futura aplicada aqui:
      dataEstimadaEntrega: ['', [Validators.required, this.futureDateValidator]],
      status: ['Pendente'],
      observacoes: ['']
    });
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(control.value);

    return inputDate >= today ? null : { pastDate: true };
  }

  onSubmit() {
    if (this.deliveryForm.valid) {
      const formValue = this.deliveryForm.value;

      const deliveryToSave = {
        ...formValue,
        historico: [{
          data: new Date().toISOString(),
          status: 'Pedido Criado',
          descricao: 'Entrega registrada no sistema'
        }]
      };

      this.deliveryService.createDelivery(deliveryToSave).subscribe({
        next: () => {
          // 1. Mostrar a mensagem de sucesso
          this.showSuccessMsg.set(true);

          // 2. Resetar o formulário
          this.deliveryForm.reset({
            dataEnvio: new Date().toISOString().split('T')[0],
            status: 'Pendente'
          });

          // 3. Notificar o pai para atualizar a lista
          this.deliveryCreated.emit();

          // 4. Esconder a mensagem após 3 segundos
          setTimeout(() => this.showSuccessMsg.set(false), 3000);
        }
      });
    }
  }

}
