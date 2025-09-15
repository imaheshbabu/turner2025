import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a unique error id', () => {
    expect(component.errorId).toBeDefined();
    expect(component.errorId.length).toBeGreaterThan(0);
  });

  it('should display error message when provided', () => {
    component.message = 'Test error message';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Test error message');
  });

  it('should emit retry event when retry button is clicked', () => {
    spyOn(component.retry, 'emit');

    component.onRetry();

    expect(component.retry.emit).toHaveBeenCalled();
  });

  it('should render retry button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const retryButton = compiled.querySelector('button');

    expect(retryButton).toBeTruthy();
  });

  it('should have proper accessibility attributes', () => {
    component.message = 'Test error';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorContainer = compiled.querySelector('[role="alert"]');

    expect(errorContainer).toBeTruthy();
  });

  describe('error id generation', () => {
    it('should generate different ids for different instances', () => {
      const component2 = new ErrorComponent();

      expect(component.errorId).not.toBe(component2.errorId);
    });
  });
});
