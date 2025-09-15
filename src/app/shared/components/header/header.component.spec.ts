import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, NoopAnimationsModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header content', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('mat-toolbar')).toBeTruthy();
  });

  describe('navigateHome', () => {
    it('should handle Enter key navigation', () => {
      const mockElement = jasmine.createSpyObj('HTMLElement', ['click']);
      const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });

      Object.defineProperty(keyboardEvent, 'target', { value: mockElement });
      spyOn(keyboardEvent, 'preventDefault');

      component.navigateHome(keyboardEvent);

      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(mockElement.click).toHaveBeenCalled();
    });

    it('should handle Space key navigation', () => {
      const mockElement = jasmine.createSpyObj('HTMLElement', ['click']);
      const keyboardEvent = new KeyboardEvent('keydown', { key: ' ' });

      Object.defineProperty(keyboardEvent, 'target', { value: mockElement });
      spyOn(keyboardEvent, 'preventDefault');

      component.navigateHome(keyboardEvent);

      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(mockElement.click).toHaveBeenCalled();
    });

    it('should not handle other keys', () => {
      const mockElement = jasmine.createSpyObj('HTMLElement', ['click']);
      const keyboardEvent = new KeyboardEvent('keydown', { key: 'Tab' });

      Object.defineProperty(keyboardEvent, 'target', { value: mockElement });
      spyOn(keyboardEvent, 'preventDefault');

      component.navigateHome(keyboardEvent);

      expect(keyboardEvent.preventDefault).not.toHaveBeenCalled();
      expect(mockElement.click).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper navigation structure', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const toolbar = compiled.querySelector('mat-toolbar');

      expect(toolbar).toBeTruthy();
    });
  });
});
