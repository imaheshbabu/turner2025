import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PlaylistCardComponent } from './playlist-card.component';
import { FeaturedPlaylistContent } from '../../../core';
import { mockFeaturedPlaylists } from '../../../data/mock-database';

describe('PlaylistCardComponent', () => {
  let component: PlaylistCardComponent;
  let fixture: ComponentFixture<PlaylistCardComponent>;
  let router: jasmine.SpyObj<Router>;

  const mockPlaylist: FeaturedPlaylistContent =
    mockFeaturedPlaylists.content[0];

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PlaylistCardComponent, NoopAnimationsModule],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    component.playlist = mockPlaylist;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display playlist information', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(mockPlaylist.name);
    expect(compiled.textContent).toContain(mockPlaylist.curator_name);
  });

  describe('onCardClick', () => {
    it('should navigate to playlist detail', () => {
      component.onCardClick();
      expect(router.navigate).toHaveBeenCalledWith([
        '/playlists',
        mockPlaylist.id,
      ]);
    });

    it('should handle keyboard space event', () => {
      const keyboardEvent = new KeyboardEvent('keydown', { key: ' ' });

      spyOn(keyboardEvent, 'preventDefault');

      component.onCardClick(keyboardEvent);

      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith([
        '/playlists',
        mockPlaylist.id,
      ]);
    });

    it('should not prevent default for other keys', () => {
      const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });

      spyOn(keyboardEvent, 'preventDefault');

      component.onCardClick(keyboardEvent);

      expect(keyboardEvent.preventDefault).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith([
        '/playlists',
        mockPlaylist.id,
      ]);
    });
  });

  describe('onViewClick', () => {
    it('should stop propagation and navigate to detail', () => {
      const event = new Event('click');

      spyOn(event, 'stopPropagation');

      component.onViewClick(event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith([
        '/playlists',
        mockPlaylist.id,
      ]);
    });
  });

  describe('onPlayClick', () => {
    it('should stop propagation and emit playlistPlay event', () => {
      const event = new Event('click');

      spyOn(event, 'stopPropagation');
      spyOn(component.playlistPlay, 'emit');

      component.onPlayClick(event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(component.playlistPlay.emit).toHaveBeenCalledWith(mockPlaylist);
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button');

      buttons.forEach(button => {
        expect(button.getAttribute('aria-label')).toBeTruthy();
      });
    });

    it('should be keyboard navigable', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const card = compiled.querySelector('mat-card');

      expect(card?.getAttribute('tabindex')).toBe('0');
      expect(card?.getAttribute('role')).toBe('button');
    });
  });
});
