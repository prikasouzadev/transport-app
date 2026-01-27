import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NewDeliveryComponent } from './new-delivery.component';
import { DeliveryService } from 'src/app/service/delivery.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Delivery } from 'src/app/interface/delivery.interface';

describe('NewDeliveryComponent', () => {
  let component: NewDeliveryComponent;
  let fixture: ComponentFixture<NewDeliveryComponent>;
  let deliveryServiceSpy: jasmine.SpyObj<DeliveryService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DeliveryService', ['createDelivery']);

    await TestBed.configureTestingModule({
      imports: [NewDeliveryComponent, ReactiveFormsModule],
      providers: [
        { provide: DeliveryService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewDeliveryComponent);
    component = fixture.componentInstance;
    deliveryServiceSpy = TestBed.inject(DeliveryService) as jasmine.SpyObj<DeliveryService>;
    fixture.detectChanges();
  });

  it('deve iniciar com o formulário inválido', () => {
    expect(component.deliveryForm.valid).toBeFalse();
  });

  it('deve validar que o nome do cliente tem no mínimo 3 caracteres', () => {
    const cliente = component.deliveryForm.controls['cliente'];
    cliente.setValue('Ab');
    expect(cliente.errors?.['minlength']).toBeTruthy();

    cliente.setValue('Abc');
    expect(cliente.errors).toBeNull();
  });

  it('deve invalidar datas passadas através do futureDateValidator', () => {
    const dataEntrega = component.deliveryForm.controls['dataEstimadaEntrega'];

    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    dataEntrega.setValue(ontem.toISOString().split('T')[0]);

    expect(dataEntrega.errors?.['pastDate']).toBeTrue();

    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    dataEntrega.setValue(amanha.toISOString().split('T')[0]);

    expect(dataEntrega.errors).toBeNull();
  });

  it('deve processar o envio corretamente e resetar o formulário', fakeAsync(() => {
    const createdDelivery: Delivery = {
      id: 999,
      cliente: 'João Silva',
      produto: 'Carga Pesada',
      endereco: 'Rua das Flores, 123',
      status: 'Pendente',
      dataEnvio: new Date().toISOString().split('T')[0],
      dataEstimada: '2026-12-31',
      historico: []
    };
    deliveryServiceSpy.createDelivery.and.returnValue(of(createdDelivery));
    spyOn(component.deliveryCreated, 'emit');

    component.deliveryForm.patchValue({
      cliente: 'João Silva',
      produto: 'Carga Pesada',
      endereco: 'Rua das Flores, 123',
      dataEstimadaEntrega: '2026-12-31'
    });

    expect(component.deliveryForm.valid).toBeTrue();

    component.onSubmit();

    expect(deliveryServiceSpy.createDelivery).toHaveBeenCalled();
    expect(component.showSuccessMsg()).toBeTrue();
    expect(component.deliveryCreated.emit).toHaveBeenCalled();
 expect(component.deliveryForm.get('status')?.value).toBe('Pendente');
    expect(component.deliveryForm.get('cliente')?.value).toBeNull();

     tick(3000);
    expect(component.showSuccessMsg()).toBeFalse();
  }));

  it('não deve chamar o serviço se o formulário estiver inválido', () => {
    component.onSubmit();
    expect(deliveryServiceSpy.createDelivery).not.toHaveBeenCalled();
  });
});
