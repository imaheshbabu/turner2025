import { TestBed } from '@angular/core/testing';
import { PlaylistStore } from './playlist.store';
import { PlaylistService } from './playlist.service';
import { FeaturedPlaylistContent } from '../models';
import { mockFeaturedPlaylists } from '../../data/mock-database';

describe('PlaylistStore', () => {
  let store: InstanceType<typeof PlaylistStore>;
  let playlistService: jasmine.SpyObj<PlaylistService>;

  const mockPlaylists: FeaturedPlaylistContent[] =
    mockFeaturedPlaylists.content.slice(0, 5);

  beforeEach(() => {
    const playlistServiceSpy = jasmine.createSpyObj('PlaylistService', [
      'getPlaylists',
      'getPlaylistById',
    ]);

    TestBed.configureTestingModule({
      providers: [
        PlaylistStore,
        { provide: PlaylistService, useValue: playlistServiceSpy },
      ],
    });

    store = TestBed.inject(PlaylistStore);
    playlistService = TestBed.inject(
      PlaylistService
    ) as jasmine.SpyObj<PlaylistService>;
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should have initial state', () => {
    expect(store.playlists()).toEqual([]);
    expect(store.selectedPlaylist()).toBeNull();
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
  });

  describe('loadPlaylists', () => {
    it('should load playlists successfully', async () => {
      playlistService.getPlaylists.and.returnValue(
        Promise.resolve(mockPlaylists)
      );

      await store.loadPlaylists();

      expect(store.playlists()).toEqual(mockPlaylists);
      expect(store.loading()).toBeFalse();
      expect(store.error()).toBeNull();
    });

    it('should handle error when loading playlists', async () => {
      const errorMessage = 'Failed to load playlists';

      playlistService.getPlaylists.and.returnValue(
        Promise.reject(new Error(errorMessage))
      );

      await store.loadPlaylists();

      expect(store.playlists()).toEqual([]);
      expect(store.loading()).toBeFalse();
      expect(store.error()).toBe(errorMessage);
    });

    it('should set loading state during playlist loading', async () => {
      let resolvePromise: (value: FeaturedPlaylistContent[]) => void;
      const promise = new Promise<FeaturedPlaylistContent[]>(resolve => {
        resolvePromise = resolve;
      });

      playlistService.getPlaylists.and.returnValue(promise);

      const loadPromise = store.loadPlaylists();

      expect(store.loading()).toBeTrue();

      resolvePromise!(mockPlaylists);
      await loadPromise;
      expect(store.loading()).toBeFalse();
    });
  });

  describe('loadPlaylistById', () => {
    it('should load playlist by id successfully', async () => {
      const playlist = mockPlaylists[0];

      playlistService.getPlaylistById.and.returnValue(
        Promise.resolve(playlist)
      );

      await store.loadPlaylistById(playlist.id);

      expect(store.selectedPlaylist()).toEqual(playlist);
      expect(store.loading()).toBeFalse();
      expect(store.error()).toBeNull();
    });

    it('should handle error when loading playlist by id', async () => {
      const errorMessage = 'Failed to load playlist';

      playlistService.getPlaylistById.and.returnValue(
        Promise.reject(new Error(errorMessage))
      );

      await store.loadPlaylistById(mockPlaylists[0].id);

      expect(store.selectedPlaylist()).toBeNull();
      expect(store.loading()).toBeFalse();
      expect(store.error()).toBe(errorMessage);
    });
  });

  describe('computed properties', () => {
    beforeEach(async () => {
      playlistService.getPlaylists.and.returnValue(
        Promise.resolve(mockPlaylists)
      );
      await store.loadPlaylists();
    });

    it('should compute publicPlaylists correctly', () => {
      expect(store.publicPlaylists()).toEqual(mockPlaylists);
    });

    it('should compute playlistsCount correctly', () => {
      expect(store.playlistsCount()).toBe(5);
    });

    it('should compute hasPlaylists correctly', () => {
      expect(store.hasPlaylists()).toBeTrue();
    });

    it('should compute allCurators correctly', () => {
      const curators = store.allCurators();
      const expectedCurators = [
        ...new Set(mockPlaylists.map(p => p.curator_name)),
      ].sort();

      expect(curators).toEqual(expectedCurators);
    });

    it('should filter playlists by name', () => {
      const searchTerm = 'New Music';
      const filteredPlaylists = store.getPlaylistsByName()(searchTerm);
      const expectedPlaylists = mockPlaylists.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(filteredPlaylists).toEqual(expectedPlaylists);
    });

    it('should filter playlists by curator', () => {
      const curatorName = 'Apple Music';
      const filteredPlaylists = store.getPlaylistsByCurator()(curatorName);
      const expectedPlaylists = mockPlaylists.filter(p =>
        p.curator_name.toLowerCase().includes(curatorName.toLowerCase())
      );

      expect(filteredPlaylists).toEqual(expectedPlaylists);
    });
  });

  describe('actions', () => {
    it('should select playlist', () => {
      const playlist = mockPlaylists[0];

      store.selectPlaylist(playlist);
      expect(store.selectedPlaylist()).toEqual(playlist);
    });

    it('should clear error', () => {
      store.clearError();
      expect(store.error()).toBeNull();
    });

    it('should reset store', () => {
      store.selectPlaylist(mockPlaylists[0]);
      store.resetStore();

      expect(store.playlists()).toEqual([]);
      expect(store.selectedPlaylist()).toBeNull();
      expect(store.loading()).toBeFalse();
      expect(store.error()).toBeNull();
    });
  });
});
