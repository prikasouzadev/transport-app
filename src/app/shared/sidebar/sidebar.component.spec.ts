import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { SidebarService } from 'src/app/service/sidebar.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let sidebarService: SidebarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SidebarComponent, // Componente Standalone vai aqui
        RouterTestingModule // Necessário por causa dos routerLinks
      ],
      providers: [SidebarService]
    }).compileComponents();


    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    sidebarService = TestBed.inject(SidebarService);
    fixture.detectChanges();
    // No seu service mock ou no componente antes do detectChanges
sidebarService.isOpen.set(true);
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

it('deve renderizar a lista de itens do menu', async () => {
  component.menuItems = [
    { label: 'Dash', route: '/1', icon: 'fa-home' },
    { label: 'List', route: '/2', icon: 'fa-list' },
    { label: 'New', route: '/3', icon: 'fa-plus' },
    { label: 'Report', route: '/4', icon: 'fa-file' }
  ];

  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  const compiled = fixture.nativeElement as HTMLElement;

  const items = compiled.querySelectorAll('nav a');

  console.log('Quantidade encontrada:', items.length);

  expect(items.length).toBe(4);
});

  it('deve alternar a variável interna isMenuOpen via toggleMenu()', () => {
    expect(component.isMenuOpen).toBeFalse();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTrue();
  });

  it('deve fechar o menu no mobile ao chamar closeMenuMobile()', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(375);

    component.isMenuOpen = true;
    component.closeMenuMobile();

    expect(component.isMenuOpen).toBeFalse();
  });

  it('NÃO deve fechar o menu no desktop ao chamar closeMenuMobile()', () => {
     spyOnProperty(window, 'innerWidth').and.returnValue(1024);

    component.isMenuOpen = true;
    component.closeMenuMobile();

    expect(component.isMenuOpen).toBeTrue();
  });

  it('deve fechar o serviço global quando o botão de fechar for clicado', () => {
    const spy = spyOn(sidebarService, 'close');
  const closeBtn = fixture.nativeElement.querySelector('button');
    closeBtn.click();

    expect(spy).toHaveBeenCalled();
  });
});
