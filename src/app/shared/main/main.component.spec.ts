import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { DeliveryService } from 'src/app/service/delivery.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Delivery } from 'src/app/interface/delivery.interface';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let deliveryServiceSpy: jasmine.SpyObj<DeliveryService>;

  const mockDeliveries: Delivery[] = [
    { id: 1, cliente: 'Cliente A', produto: 'Carga 1', status: 'Pendente', endereco: 'Rua 1', dataEstimada: '26/01/2026', dataEnvio: '20/01/2026', historico: [] },
    { id: 2, cliente: 'Cliente B', produto: 'Carga 2', status: 'Entregue', endereco: 'Rua 2', dataEstimada: '27/01/2026', dataEnvio: '21/01/2026', historico: [] }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DeliveryService', ['getDeliveries']);

    await TestBed.configureTestingModule({
      imports: [
        MainComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: DeliveryService, useValue: spy }
      ]
    }).compileComponents();

    deliveryServiceSpy = TestBed.inject(DeliveryService) as jasmine.SpyObj<DeliveryService>;
    deliveryServiceSpy.getDeliveries.and.returnValue(of(mockDeliveries));

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado e carregar entregas no início (ngOnInit)', () => {
    expect(component).toBeTruthy();
    expect(deliveryServiceSpy.getDeliveries).toHaveBeenCalled();
    expect(component.allDeliveries().length).toBe(2);
    expect(component.allDeliveries()).toEqual(mockDeliveries);
  });

it('deve renderizar as abas de navegação corretamente', async () => {
  if (!component.tabs || component.tabs.length === 0) {
    component.tabs = [
      { label: 'Entregas', route: '/delivery-list' },
      { label: 'Dashboard', route: '/dashboard' },
      { label: 'Relatórios', route: '/report' }
    ];
  }

  fixture.detectChanges();

 await fixture.whenStable();

  fixture.detectChanges();

  const compiled = fixture.nativeElement as HTMLElement;

   const tabElements = compiled.querySelectorAll('.group button');

  if (tabElements.length === 0) {
    console.log('HTML capturado no teste:', compiled.innerHTML);
  }

  expect(tabElements.length).toBe(component.tabs.length);
});

  it('deve lidar com erro na sincronização de dados', () => {
     deliveryServiceSpy.getDeliveries.and.returnValue(throwError(() => new Error('Erro de API')));
  const consoleSpy = spyOn(console, 'error');

    component.loadAllDeliveries();

    expect(consoleSpy).toHaveBeenCalledWith('Falha na sincronização:', jasmine.any(Error));
  });

  it('deve ter as rotas configuradas corretamente nos objetos das abas', () => {
    expect(component.tabs[0].route).toBe('/delivery-list');
    expect(component.tabs[1].route).toBe('/dashboard');
    expect(component.tabs[2].route).toBe('/report');
  });
});
