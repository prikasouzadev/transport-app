import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { MainComponent } from './shared/main/main.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Chart, registerables } from 'chart.js';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    Chart.register(...registerables);

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        HeaderComponent,
        SidebarComponent,
        MainComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar a aplicação', () => {
    expect(component).toBeTruthy();
  });

  it(`deve ter o título 'transportadora-app'`, () => {
    expect(component.title).toEqual('transportadora-app');
  });

  it('deve renderizar o Header, Sidebar e Main no layout', () => {
    const compiled = fixture.nativeElement as HTMLElement;
  expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('app-sidebar')).toBeTruthy();
    expect(compiled.querySelector('app-main')).toBeTruthy();
  });
});
