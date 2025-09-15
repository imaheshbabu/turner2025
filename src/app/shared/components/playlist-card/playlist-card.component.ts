import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FeaturedPlaylistContent } from '../../../core';

@Component({
  selector: 'app-playlist-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './playlist-card.component.html',
  styleUrl: './playlist-card.component.scss',
})
export class PlaylistCardComponent {
  @Input({ required: true }) playlist!: FeaturedPlaylistContent;
  @Output() playlistPlay = new EventEmitter<FeaturedPlaylistContent>();
  private readonly router = inject(Router);
  onCardClick(event?: Event): void {
    if (event && event.type === 'keydown') {
      const keyboardEvent = event as KeyboardEvent;

      if (keyboardEvent.key === ' ') {
        keyboardEvent.preventDefault();
      }
    }
    this.navigateToDetail();
  }
  onViewClick(event: Event): void {
    event.stopPropagation();
    this.navigateToDetail();
  }
  onPlayClick(event: Event): void {
    event.stopPropagation();
    this.playlistPlay.emit(this.playlist);
  }
  private navigateToDetail(): void {
    this.router.navigate(['/playlists', this.playlist.id]);
  }
}
