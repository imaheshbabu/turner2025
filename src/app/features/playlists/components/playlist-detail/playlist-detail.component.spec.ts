import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PlaylistDetailComponent } from './playlist-detail.component';
import { FeaturedPlaylistContent, PlaylistStore } from '../../../../core';
import { mockFeaturedPlaylists } from '../../../../data/mock-database';

describe('PlaylistDetailComponent', () => {
  let component: PlaylistDetailComponent;
  let fixture: ComponentFixture<PlaylistDetailComponent>;
  let mockStore: jasmine.SpyObj<InstanceType<typeof PlaylistStore>>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  const mockPlaylist: FeaturedPlaylistContent =
    mockFeaturedPlaylists.content[0];

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('PlaylistStore', [
      'loadPlaylistById',
      'selectPlaylist',
      'loading',
      'error',
      'selectedPlaylist',
    ]);

    storeSpy.loading.and.returnValue(false);
    storeSpy.error.and.returnValue(null);
    storeSpy.selectedPlaylist.and.returnValue(mockPlaylist);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(mockPlaylist.id),
        },
      },
    } as unknown as jasmine.SpyObj<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [PlaylistDetailComponent, NoopAnimationsModule],
      providers: [
        { provide: PlaylistStore, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistDetailComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(PlaylistStore) as jasmine.SpyObj<
      InstanceType<typeof PlaylistStore>
    >;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load playlist on init with valid id', () => {
    component.ngOnInit();
    expect(mockStore.loadPlaylistById).toHaveBeenCalledWith(mockPlaylist.id);
  });

  it('should navigate to not-found when no id provided', () => {
    (mockActivatedRoute.snapshot.paramMap.get as jasmine.Spy).and.returnValue(
      null
    );

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/not-found']);
  });

  it('should clear selected playlist on destroy', () => {
    component.ngOnDestroy();
    expect(mockStore.selectPlaylist).toHaveBeenCalledWith(null);
  });

  it('should retry loading playlist', () => {
    component.onRetry();
    expect(mockStore.loadPlaylistById).toHaveBeenCalledWith(mockPlaylist.id);
  });

  it('should navigate back to playlist list', () => {
    component.onBackToList();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/playlists']);
  });

  describe('isPlaylistNotFound', () => {
    it('should return true when not loading, no error, and no selected playlist', () => {
      mockStore.loading.and.returnValue(false);
      mockStore.error.and.returnValue(null);
      mockStore.selectedPlaylist.and.returnValue(null);

      expect(component['isPlaylistNotFound']).toBeTrue();
    });

    it('should return false when loading', () => {
      mockStore.loading.and.returnValue(true);
      mockStore.error.and.returnValue(null);
      mockStore.selectedPlaylist.and.returnValue(null);

      expect(component['isPlaylistNotFound']).toBeFalse();
    });

    it('should return false when there is an error', () => {
      mockStore.loading.and.returnValue(false);
      mockStore.error.and.returnValue('Error message');
      mockStore.selectedPlaylist.and.returnValue(null);

      expect(component['isPlaylistNotFound']).toBeFalse();
    });

    it('should return false when playlist is selected', () => {
      mockStore.loading.and.returnValue(false);
      mockStore.error.and.returnValue(null);
      mockStore.selectedPlaylist.and.returnValue(mockPlaylist);

      expect(component['isPlaylistNotFound']).toBeFalse();
    });
  });

  describe('template rendering', () => {
    it('should show loading component when loading', () => {
      mockStore.loading.and.returnValue(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('app-loading')).toBeTruthy();
    });

    it('should show error component when error exists', () => {
      mockStore.error.and.returnValue('Test error');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('app-error')).toBeTruthy();
    });

    it('should show playlist details when playlist is loaded', () => {
      mockStore.selectedPlaylist.and.returnValue(mockPlaylist);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent).toContain(mockPlaylist.name);
    });
  });
});
