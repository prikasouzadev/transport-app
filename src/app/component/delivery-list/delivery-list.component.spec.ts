import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliveryListComponent } from './delivery-list.component';
import { DeliveryService } from 'src/app/service/delivery.service';
import { of } from 'rxjs';
import { Delivery } from 'src/app/interface/delivery.interface';

describe('DeliveryListComponent', () => {
  let component: DeliveryListComponent;
  let fixture: ComponentFixture<DeliveryListComponent>;
  let deliveryServiceSpy: jasmine.SpyObj<DeliveryService>;


const mockDeliveries: Delivery[] = [
  { id: 1, cliente: 'Apple', status: 'Entregue', produto: 'iPhone', endereco: 'Rua A', dataEnvio: '2026-01-01', dataEstimada: '2026-01-13', historico: [] },
  { id: 2, cliente: 'Amazon', status: 'Pendente', produto: 'Echo', endereco: 'Rua B', dataEnvio: '2026-01-01', dataEstimada: '2026-01-13', historico: [] },
  { id: 3, cliente: 'Google', status: 'Em Rota', produto: 'Pixel', endereco: 'Rua C', dataEnvio: '2026-01-01', dataEstimada: '2026-01-13', historico: [] },
  { id: 4, cliente: 'Apple South', status: 'Pendente', produto: 'Macbook', endereco: 'Rua D', dataEnvio: '2026-01-01', dataEstimada: '2026-01-13', historico: [] },
   ...Array(5).fill(null).map((_, i) => ({
    id: (i + 5),
    cliente: `Cliente ${i}`,
    status: 'Entregue',
    produto: 'Produto Genérico',
    endereco: 'Endereço Teste',
    dataEnvio: '2026-01-01',
    dataEstimada: '2026-01-13',
    historico: []
  } as Delivery))
];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DeliveryService', ['getDeliveries']);

    await TestBed.configureTestingModule({
      imports: [DeliveryListComponent],
      providers: [{ provide: DeliveryService, useValue: spy }]
    }).compileComponents();

    deliveryServiceSpy = TestBed.inject(DeliveryService) as jasmine.SpyObj<DeliveryService>;
    deliveryServiceSpy.getDeliveries.and.returnValue(of(mockDeliveries as Delivery[]));

    fixture = TestBed.createComponent(DeliveryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve carregar as entregas e inicializar os signals', () => {
    expect(component.deliveries().length).toBe(9);
    expect(component.totalPages()).toBe(2);
  });

  it('deve filtrar os dados por termo de busca (cliente)', () => {
    component.searchTerm.set('Apple');
    fixture.detectChanges();

    expect(component.filteredData().length).toBe(2);
    expect(component.filteredData().every(d => d.cliente.includes('Apple'))).toBeTrue();
  });

  it('deve filtrar os dados por status', () => {
    component.filterStatus.set('Pendente');
    fixture.detectChanges();

    expect(component.filteredData().length).toBe(2);
    expect(component.filteredData().every(d => d.status === 'Pendente')).toBeTrue();
  });

  it('deve retornar a fatia correta de dados na paginação', () => {
     expect(component.paginatedData().length).toBe(7);

    component.currentPage.set(2);
    fixture.detectChanges();

     expect(component.paginatedData().length).toBe(2);
  });

  it('deve abrir o modal de detalhes corretamente', () => {
    const delivery = mockDeliveries[0];
    component.openDetails(delivery);

    expect(component.isModalOpen()).toBeTrue();
    expect(component.selectedDelivery()).toEqual(delivery);
  });

  it('deve retornar a classe CSS correta para o status', () => {
    const css = component.getStatusClass('Entregue');
    expect(css).toContain('bg-green-100');
    expect(css).toContain('text-green-700');
  });

  it('deve resetar para a primeira página ao buscar (lógica integrada)', () => {
     component.currentPage.set(2);
    component.searchTerm.set('Amazon');
    component.currentPage.set(1);

    expect(component.currentPage()).toBe(1);
  });

  it('deve chamar a função de exportar PDF sem erros', () => {
  expect(() => component.exportToPDF()).not.toThrow();
});
});
