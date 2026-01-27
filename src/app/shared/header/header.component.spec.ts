import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { SidebarService } from 'src/app/service/sidebar.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let sidebarService: SidebarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [SidebarService]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    sidebarService = TestBed.inject(SidebarService);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar o método toggle do SidebarService ao clicar no botão hambúrguer', () => {
    const spy = spyOn(sidebarService, 'toggle').and.callThrough();

    const menuBtn = fixture.nativeElement.querySelector('button');

    menuBtn.click();

     expect(spy).toHaveBeenCalled();
  });

  it('deve refletir a mudança de estado do serviço no componente', () => {
    expect(sidebarService.isOpen()).toBeFalse();

    sidebarService.toggle();
    fixture.detectChanges();

    expect(sidebarService.isOpen()).toBeTrue();
  });

  it('deve conter o título da marca "Truck Fast"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const brandText = compiled.querySelector('span')?.textContent;
    expect(brandText).toContain('Truck Fast');
  });
});
