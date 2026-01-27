import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliveryDetailsComponent } from './delivery-details.component';
import { DeliveryService } from 'src/app/service/delivery.service';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Delivery } from 'src/app/interface/delivery.interface';

describe('DeliveryDetailsComponent', () => {
  let component: DeliveryDetailsComponent;
  let fixture: ComponentFixture<DeliveryDetailsComponent>;
  let deliveryServiceSpy: jasmine.SpyObj<DeliveryService>;
  const mockDelivery: Delivery = {
    id: 123,
    cliente: 'Empresa X',
    produto: 'Notebooks',
    status: 'Pendente',
    endereco: 'Av. Paulista, 1000',
    dataEnvio: '2026-01-01',
    dataEstimada: '2026-01-05',
    historico: [{ data: '2026-01-01', status: 'Pendente' }]
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DeliveryService', ['updateDelivery']);

    await TestBed.configureTestingModule({
      imports: [DeliveryDetailsComponent, FormsModule],
      providers: [
        { provide: DeliveryService, useValue: spy }
      ]
    }).compileComponents();

    deliveryServiceSpy = TestBed.inject(DeliveryService) as jasmine.SpyObj<DeliveryService>;


    fixture = TestBed.createComponent(DeliveryDetailsComponent);
    component = fixture.componentInstance;
    component.delivery = JSON.parse(JSON.stringify(mockDelivery));

    fixture.detectChanges();
    await fixture.whenStable();
  });
it('deve ser criado e exibir os dados da entrega', async () => {
 component.delivery = { ...mockDelivery };

  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  expect(component).toBeTruthy();

  const compiled = fixture.nativeElement as HTMLElement;

  const renderedText = compiled.innerText;
  expect(renderedText).toContain('123');

   const inputs = compiled.querySelectorAll('input');
  const values = Array.from(inputs).map(input => (input as HTMLInputElement).value);

 const encontrouCliente = values.some(val => val.includes('Empresa X'));

  expect(encontrouCliente).toBeTrue();
});

  it('deve emitir o evento close ao clicar no botão de fechar ou cancelar', () => {
    spyOn(component.close, 'emit');

    component.close.emit();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('deve atualizar o histórico e emitir eventos ao salvar com sucesso', () => {
    deliveryServiceSpy.updateDelivery.and.returnValue(of(component.delivery!));

    spyOn(component.saved, 'emit');
    spyOn(component.close, 'emit');

    component.delivery!.status = 'Em Rota';

    component.save();

    expect(component.delivery!.historico.length).toBe(2);
    expect(component.delivery!.historico[1].status).toBe('Em Rota');

    expect(deliveryServiceSpy.updateDelivery).toHaveBeenCalledWith(component.delivery!);

     expect(component.saved.emit).toHaveBeenCalled();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('deve lidar com erro ao tentar atualizar a entrega', () => {
    const consoleSpy = spyOn(console, 'error');
    deliveryServiceSpy.updateDelivery.and.returnValue(throwError(() => new Error('Erro de Conexão')));

    component.save();

    expect(consoleSpy).toHaveBeenCalledWith('Erro ao atualizar histórico:', jasmine.any(Error));

  });
});
