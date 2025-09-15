import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { PlaylistStore } from '../../../../core';
import {
  ErrorComponent,
  LoadingComponent,
} from '../../../../shared/components';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    LoadingComponent,
    ErrorComponent,
  ],
  templateUrl: './playlist-detail.component.html',
  styleUrl: './playlist-detail.component.scss',
})
export class PlaylistDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected store = inject(PlaylistStore);

  ngOnInit(): void {
    const playlistId = this.route.snapshot.paramMap.get('id');

    if (playlistId) {
      this.store.loadPlaylistById(playlistId);
    } else {
      this.navigateToNotFound();
    }
  }

  ngOnDestroy(): void {
    this.store.selectPlaylist(null);
  }

  onRetry(): void {
    const playlistId = this.route.snapshot.paramMap.get('id');

    if (playlistId) {
      this.store.loadPlaylistById(playlistId);
    }
  }

  onBackToList(): void {
    this.router.navigate(['/playlists']);
  }

  private navigateToNotFound(): void {
    this.router.navigate(['/not-found']);
  }

  protected get isPlaylistNotFound(): boolean {
    return (
      !this.store.loading() &&
      !this.store.error() &&
      !this.store.selectedPlaylist()
    );
  }
}
