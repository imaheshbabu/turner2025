import { TestBed } from '@angular/core/testing';
import { PlaylistService } from './playlist.service';

describe('PlaylistService', () => {
  let service: PlaylistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaylistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPlaylists', () => {
    it('should return playlists', async () => {
      const playlists = await service.getPlaylists();

      expect(playlists).toBeDefined();
      expect(Array.isArray(playlists)).toBeTrue();
      expect(playlists.length).toBeGreaterThan(0);
    });

    it('should return playlists with correct structure', async () => {
      const playlists = await service.getPlaylists();
      const playlist = playlists[0];

      expect(playlist.id).toBeDefined();
      expect(playlist.kind).toBeDefined();
      expect(playlist.name).toBeDefined();
      expect(playlist.url).toBeDefined();
      expect(playlist.curator_name).toBeDefined();
      expect(playlist.artwork).toBeDefined();
    });

    it('should return a copy of the data', async () => {
      const playlists1 = await service.getPlaylists();
      const playlists2 = await service.getPlaylists();

      expect(playlists1).not.toBe(playlists2);
      expect(playlists1).toEqual(playlists2);
    });
  });

  describe('getPlaylistById', () => {
    it('should return playlist when valid id is provided', async () => {
      const allPlaylists = await service.getPlaylists();
      const firstPlaylist = allPlaylists[0];

      const playlist = await service.getPlaylistById(firstPlaylist.id);

      expect(playlist).toBeDefined();
      expect(playlist?.id).toBe(firstPlaylist.id);
    });

    it('should return null when playlist not found', async () => {
      const playlist = await service.getPlaylistById('non-existent-id');

      expect(playlist).toBeNull();
    });

    it('should throw error for invalid id', async () => {
      await expectAsync(service.getPlaylistById('')).toBeRejectedWithError(
        'Invalid playlist ID provided'
      );
      await expectAsync(
        service.getPlaylistById(null as unknown as string)
      ).toBeRejectedWithError('Invalid playlist ID provided');
    });

    it('should return a copy of the playlist', async () => {
      const allPlaylists = await service.getPlaylists();
      const firstPlaylist = allPlaylists[0];

      const playlist1 = await service.getPlaylistById(firstPlaylist.id);
      const playlist2 = await service.getPlaylistById(firstPlaylist.id);

      expect(playlist1).not.toBe(playlist2);
      expect(playlist1).toEqual(playlist2);
    });
  });

  describe('getPublicPlaylists', () => {
    it('should return all playlists as public', async () => {
      const allPlaylists = await service.getPlaylists();
      const publicPlaylists = await service.getPublicPlaylists();

      expect(publicPlaylists).toEqual(allPlaylists);
    });
  });
});
