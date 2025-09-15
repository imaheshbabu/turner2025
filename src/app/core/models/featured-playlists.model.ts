export interface FeaturedPlaylistContent {
  id: string;
  kind: string;
  name: string;
  url: string;
  curator_name: string;
  artwork: string;
}

export interface FeaturedPlaylists {
  name: string;
  content: FeaturedPlaylistContent[];
}

export interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface PlaylistState {
  playlists: FeaturedPlaylistContent[];
  selectedPlaylist: FeaturedPlaylistContent | null;
  loading: boolean;
  error: string | null;
}
