import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DeliveryService } from 'src/app/service/delivery.service';
import { of } from 'rxjs';
import { Delivery } from 'src/app/interface/delivery.interface';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables); 

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let deliveryServiceSpy: jasmine.SpyObj<DeliveryService>;


  const hoje = new Date().toISOString().split('T')[0];
  const mockDeliveries: Delivery[] = [
    { id: 1, cliente: 'A', produto: 'P1', status: 'Pendente', endereco: 'R1', dataEnvio: hoje, dataEstimada: '27/01/2026', historico: [] },
    { id: 2, cliente: 'B', produto: 'P2', status: 'Em Rota', endereco: 'R2', dataEnvio: hoje, dataEstimada: '27/01/2026', historico: [] },
    { id: 3, cliente: 'C', produto: 'P3', status: 'Entregue', endereco: 'R3', dataEnvio: '2025-01-01', dataEstimada: '27/01/2026', historico: [] },
    { id: 4, cliente: 'D', produto: 'P4', status: 'Cancelada', endereco: 'R4', dataEnvio: hoje, dataEstimada: '27/01/2026', historico: [] }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DeliveryService', ['getDeliveries']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: DeliveryService, useValue: spy }
      ]
    }).compileComponents();

    deliveryServiceSpy = TestBed.inject(DeliveryService) as jasmine.SpyObj<DeliveryService>;
    deliveryServiceSpy.getDeliveries.and.returnValue(of(mockDeliveries));

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve calcular as estatísticas corretamente através do computed signal', () => {
    fixture.detectChanges();

    const s = component.stats();

    expect(s.total).toBe(4);
    expect(s.pendentes).toBe(1);
    expect(s.emRota).toBe(1);
    expect(s.entregues).toBe(1);
    expect(s.canceladas).toBe(1);
    expect(s.novas).toBe(3);
  });

  it('deve chamar createChart após carregar os dados com atraso (setTimeout)', fakeAsync(() => {
    const chartSpy = spyOn(component, 'createChart').and.callThrough();

    fixture.detectChanges();

    tick(100);

    expect(chartSpy).toHaveBeenCalled();
  }));

  it('deve atualizar as estatísticas automaticamente se o sinal de deliveries mudar', () => {
    fixture.detectChanges();
    const novaEntrega: Delivery = {
      id: 5, cliente: 'E', produto: 'P5', status: 'Pendente', endereco: 'R5', dataEnvio: '27/01/2026', dataEstimada: '30/01/2026', historico: []
    };

    component.deliveries.set([...mockDeliveries, novaEntrega]);
  expect(component.stats().total).toBe(5);
    expect(component.stats().pendentes).toBe(2);
  });
});
