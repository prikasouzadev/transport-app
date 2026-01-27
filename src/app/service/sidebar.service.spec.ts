import { TestBed } from '@angular/core/testing';
import { SidebarService } from './sidebar.service';

describe('SidebarService', () => {
  let service: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SidebarService] // Explicitando o provider
    });
    service = TestBed.inject(SidebarService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve iniciar com o menu fechado (estado inicial)', () => {
    expect(service.isOpen()).toBeFalse();
  });

  it('deve abrir o menu ao chamar toggle()', () => {
    service.toggle();
    expect(service.isOpen()).withContext('Menu deveria estar aberto após toggle').toBeTrue();
  });

  it('deve fechar o menu explicitamente ao chamar close()', () => {
    service.toggle(); // Abre
    expect(service.isOpen()).toBeTrue();

    service.close(); // Fecha
    expect(service.isOpen()).toBeFalse();
  });

  it('deve manter o estado fechado se close() for chamado repetidamente', () => {
    service.close();
    service.close();
    expect(service.isOpen()).toBeFalse();
  });

  it('deve alternar o estado sucessivamente ao chamar toggle()', () => {
    service.toggle(); // Abre
    expect(service.isOpen()).toBeTrue();

    service.toggle(); // Fecha
    expect(service.isOpen()).toBeFalse();

    service.toggle(); // Abre novamente
    expect(service.isOpen()).toBeTrue();
  });
});
