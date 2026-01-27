import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DeliveryService } from './delivery.service';
import { Delivery } from '../interface/delivery.interface';

describe('DeliveryService', () => {
  let service: DeliveryService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/deliveries';


  const mockDelivery: Delivery = {
    id: 1,
    cliente: 'Empresa Teste',
    produto: 'Carga 01',
    status: 'Pendente',
    endereco: 'Rua Teste, 123',
    dataEnvio: '2026-01-27',
    dataEstimada: '2026-01-30',
    historico: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryService]
    });

    service = TestBed.inject(DeliveryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

 afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar todas as entregas (GET)', () => {
    const mockDeliveries: Delivery[] = [mockDelivery];

    service.getDeliveries().subscribe(deliveries => {
      expect(deliveries.length).toBe(1);
      expect(deliveries).toEqual(mockDeliveries);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockDeliveries);
  });

  it('deve buscar uma entrega por ID (GET)', () => {
    service.getDeliveryById(1).subscribe(delivery => {
      expect(delivery).toEqual(mockDelivery);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDelivery);
  });

  it('deve criar uma nova entrega (POST)', () => {
    const newDelivery: Partial<Delivery> = { cliente: 'Novo Cliente' };

    service.createDelivery(newDelivery).subscribe(delivery => {
      expect(delivery).toEqual(mockDelivery);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newDelivery);
    req.flush(mockDelivery);
  });

  it('deve atualizar uma entrega existente (PUT)', () => {
    service.updateDelivery(mockDelivery).subscribe(delivery => {
      expect(delivery).toEqual(mockDelivery);
    });

    const req = httpMock.expectOne(`${apiUrl}/${mockDelivery.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockDelivery);
  });
});
