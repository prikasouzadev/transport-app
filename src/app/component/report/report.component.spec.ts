import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportComponent } from './report.component';
import { DeliveryService } from 'src/app/service/delivery.service';
import { of } from 'rxjs';
import { Delivery } from 'src/app/interface/delivery.interface';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;
  let deliveryServiceSpy: jasmine.SpyObj<DeliveryService>;

  const mockDeliveries: Delivery[] = [
    { id: 1, cliente: 'C1', status: 'Entregue', produto: 'P1', endereco: 'E1', dataEnvio: '2026-01-01', dataEstimada: '2026-01-01', historico: [] },
    { id: 2, cliente: 'C2', status: 'Pendente', produto: 'P2', endereco: 'E2', dataEnvio: '2026-01-01', dataEstimada: '2026-01-01', historico: [] },
    { id: 3, cliente: 'C3', status: 'Entregue', produto: 'P3', endereco: 'E3', dataEnvio: '2026-01-01', dataEstimada: '2026-01-01', historico: [] },
    { id: 4, cliente: 'C4', status: 'Cancelada', produto: 'P4', endereco: 'E4', dataEnvio: '2026-01-01', dataEstimada: '2026-01-01', historico: [] },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DeliveryService', ['getDeliveries']);

    await TestBed.configureTestingModule({
      imports: [ReportComponent],
      providers: [
        { provide: DeliveryService, useValue: spy }
      ]
    }).compileComponents();

    deliveryServiceSpy = TestBed.inject(DeliveryService) as jasmine.SpyObj<DeliveryService>;
    deliveryServiceSpy.getDeliveries.and.returnValue(of(mockDeliveries));

    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve calcular as métricas iniciais corretamente', () => {
    const m = component.metrics();
    expect(m.taxaSucesso).toBe(50);
    expect(m.totalVolume).toBe(4);
    expect(m.pendenciaCritica).toBe(1);
  });

  it('deve retornar 0 nas métricas quando não houver entregas (evitar divisão por zero)', () => {
    component.deliveries.set([]);
    fixture.detectChanges();

    const m = component.metrics();
    expect(m.taxaSucesso).toBe(0);
    expect(m.totalVolume).toBe(0);
  });

  it('deve filtrar os dados de auditoria baseados no sinal filtroStatus', () => {
    component.filtroStatus.set('Entregue');
    fixture.detectChanges();
    expect(component.reportData().length).toBe(2);
    expect(component.reportData().every(d => d.status === 'Entregue')).toBeTrue();

    component.filtroStatus.set('Todos');
    fixture.detectChanges();
    expect(component.reportData().length).toBe(4);
  });

  it('deve atualizar o relatório quando novas entregas forem adicionadas ao sinal', () => {
    const novaEntrega: Delivery = {
      id: 5, cliente: 'C5', status: 'Entregue', produto: 'P5', endereco: 'E5', dataEnvio: '2026-01-27', dataEstimada: '2026-01-27', historico: []
    };

    component.deliveries.set([...mockDeliveries, novaEntrega]);
    fixture.detectChanges();

    expect(component.metrics().taxaSucesso).toBe(60);
    expect(component.reportData().length).toBe(5);
  });

  it('deve chamar a função de exportação sem erros', () => {
    expect(() => component.exportFullPDF()).not.toThrow();
  });
});
