import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { FeaturedPlaylistContent, PlaylistState } from '../models';
import { PlaylistService } from './playlist.service';

const initialState: PlaylistState = {
  playlists: [],
  selectedPlaylist: null,
  loading: false,
  error: null,
};

export const PlaylistStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, playlistService = inject(PlaylistService)) => ({
    async loadPlaylists() {
      if (store.playlists() && store.playlists().length > 0) {
        return;
      }
      patchState(store, { loading: true, error: null });
      try {
        const playlists = await playlistService.getPlaylists();

        patchState(store, { playlists: playlists || [], loading: false });
      } catch (error) {
        patchState(store, {
          error:
            error instanceof Error ? error.message : 'Failed to load playlists',
          loading: false,
        });
      }
    },
    async loadPlaylistById(id: string) {
      const current = store.selectedPlaylist();

      if (current && current.id === id) {
        return;
      }
      patchState(store, { loading: true, error: null });
      try {
        const playlist = await playlistService.getPlaylistById(id);

        patchState(store, {
          selectedPlaylist: playlist,
          loading: false,
        });
      } catch (error) {
        patchState(store, {
          error:
            error instanceof Error ? error.message : 'Failed to load playlist',
          loading: false,
        });
      }
    },
    selectPlaylist(playlist: FeaturedPlaylistContent | null) {
      patchState(store, { selectedPlaylist: playlist });
    },
    clearError() {
      patchState(store, { error: null });
    },
    resetStore() {
      patchState(store, initialState);
    },
  })),
  withComputed(state => ({
    publicPlaylists: computed(() => state.playlists() || []),
    playlistsCount: computed(() => state.playlists()?.length || 0),
    getPlaylistsByName: computed(
      () => (searchTerm: string) =>
        state
          .playlists()
          ?.filter(playlist =>
            playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
          ) || []
    ),
    getPlaylistsByCurator: computed(
      () => (curator: string) =>
        state
          .playlists()
          ?.filter(playlist =>
            playlist.curator_name.toLowerCase().includes(curator.toLowerCase())
          ) || []
    ),
    hasPlaylists: computed(() => state.playlists()?.length > 0 || false),
    hasError: computed(() => !!state.error()),
    isLoading: computed(() => state.loading()),
    allCurators: computed(() => {
      const playlists = state.playlists();

      if (!playlists) return [];
      const curators = playlists.map(playlist => playlist.curator_name);

      return [...new Set(curators)].sort();
    }),
  }))
);
