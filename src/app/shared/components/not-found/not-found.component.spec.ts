import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [NotFoundComponent, NoopAnimationsModule],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render not found content', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('mat-card')).toBeTruthy();
  });

  describe('navigateHome', () => {
    it('should navigate to playlists page', () => {
      component.navigateHome();
      expect(router.navigate).toHaveBeenCalledWith(['/playlists']);
    });
  });

  describe('goBack', () => {
    it('should call window.history.back', () => {
      spyOn(window.history, 'back');

      component.goBack();

      expect(window.history.back).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const heading = compiled.querySelector('h1, h2');

      expect(heading).toBeTruthy();
    });

    it('should have navigation buttons', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button');

      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
