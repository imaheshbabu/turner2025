import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PlaylistListComponent } from './playlist-list.component';
import { FeaturedPlaylistContent, PlaylistStore } from '../../../../core';
import { PageEvent } from '@angular/material/paginator';
import { mockFeaturedPlaylists } from '../../../../data/mock-database';

describe('PlaylistListComponent', () => {
  let component: PlaylistListComponent;
  let fixture: ComponentFixture<PlaylistListComponent>;
  let mockStore: jasmine.SpyObj<InstanceType<typeof PlaylistStore>>;

  const mockPlaylists: FeaturedPlaylistContent[] =
    mockFeaturedPlaylists.content.slice(0, 25);

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('PlaylistStore', [
      'loadPlaylists',
      'selectPlaylist',
      'clearError',
      'isLoading',
      'error',
      'publicPlaylists',
      'hasPlaylists',
    ]);

    storeSpy.isLoading.and.returnValue(false);
    storeSpy.error.and.returnValue(null);
    storeSpy.publicPlaylists.and.returnValue(mockPlaylists);
    storeSpy.hasPlaylists.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [PlaylistListComponent, NoopAnimationsModule],
      providers: [{ provide: PlaylistStore, useValue: storeSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistListComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(PlaylistStore) as jasmine.SpyObj<
      InstanceType<typeof PlaylistStore>
    >;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load playlists on init', () => {
    component.ngOnInit();
    expect(mockStore.loadPlaylists).toHaveBeenCalled();
  });

  describe('pagination', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display correct number of playlists per page', () => {
      expect(component.playlists().length).toBe(10);
    });

    it('should calculate total items correctly', () => {
      expect(component.totalItems()).toBe(25);
    });

    it('should handle page change', () => {
      const pageEvent: PageEvent = {
        pageIndex: 1,
        pageSize: 10,
        length: 25,
      };

      component.onPageChange(pageEvent);

      expect(component.currentPage()).toBe(1);
      expect(component.pageSize()).toBe(10);
    });

    it('should handle page size change', () => {
      const pageEvent: PageEvent = {
        pageIndex: 0,
        pageSize: 20,
        length: 25,
      };

      component.onPageChange(pageEvent);

      expect(component.pageSize()).toBe(20);
      expect(component.playlists().length).toBe(20);
    });

    it('should show correct playlists for second page', () => {
      component.currentPage.set(1);
      fixture.detectChanges();

      const displayedPlaylists = component.playlists();

      expect(displayedPlaylists.length).toBe(10);
      expect(displayedPlaylists[0].id).toBe(mockPlaylists[10].id);
    });
  });

  describe('playlist interactions', () => {
    it('should handle playlist play', () => {
      const playlist = mockPlaylists[0];

      component.onPlaylistPlay(playlist);

      expect(mockStore.selectPlaylist).toHaveBeenCalledWith(playlist);
    });
  });

  describe('error handling', () => {
    it('should handle retry', () => {
      component.onRetry();

      expect(mockStore.clearError).toHaveBeenCalled();
      expect(mockStore.loadPlaylists).toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should show loading component when loading', () => {
      mockStore.isLoading.and.returnValue(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('app-loading')).toBeTruthy();
    });
  });

  describe('error state', () => {
    it('should show error component when error exists', () => {
      mockStore.error.and.returnValue('Test error message');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('app-error')).toBeTruthy();
    });
  });

  describe('empty state', () => {
    it('should show empty state when no playlists', () => {
      mockStore.publicPlaylists.and.returnValue([]);
      mockStore.hasPlaylists.and.returnValue(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent).toContain('No Playlists Available');
    });
  });

  describe('computed properties', () => {
    it('should compute start and end indices correctly', () => {
      component.currentPage.set(1);
      component.pageSize.set(10);

      expect(component.startIndex()).toBe(10);
      expect(component.endIndex()).toBe(20);
    });

    it('should slice playlists correctly based on pagination', () => {
      component.currentPage.set(2);
      component.pageSize.set(5);

      const displayedPlaylists = component.playlists();

      expect(displayedPlaylists.length).toBe(5);
      expect(displayedPlaylists[0].id).toBe(mockPlaylists[10].id);
    });
  });
});
