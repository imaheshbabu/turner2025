import { Injectable } from '@angular/core';
import { FeaturedPlaylistContent } from '../models';
import { mockFeaturedPlaylists } from '../../data/mock-database';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private readonly mockData = mockFeaturedPlaylists.content;
  async getPlaylists(): Promise<FeaturedPlaylistContent[]> {
    await this.delay(1000);

    return [...this.mockData];
  }
  async getPlaylistById(id: string): Promise<FeaturedPlaylistContent | null> {
    if (!id) {
      throw new Error('Invalid playlist ID provided');
    }
    await this.delay(1000);
    
    const playlist = this.mockData.find(
      (p: FeaturedPlaylistContent) => p.id === id
    );

    return playlist ? { ...playlist } : null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async getPublicPlaylists(): Promise<FeaturedPlaylistContent[]> {
    return await this.getPlaylists();
  }
}
