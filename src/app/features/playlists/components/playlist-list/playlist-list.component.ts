import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FeaturedPlaylistContent, PlaylistStore } from '../../../../core';
import {
  ErrorComponent,
  LoadingComponent,
  PlaylistCardComponent,
} from '../../../../shared/components';

@Component({
  selector: 'app-playlist-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PlaylistCardComponent,
    LoadingComponent,
    ErrorComponent,
    MatPaginatorModule,
  ],
  templateUrl: './playlist-list.component.html',
  styleUrl: './playlist-list.component.scss',
})
export class PlaylistListComponent implements OnInit {
  private readonly store = inject(PlaylistStore);

  readonly pageSize = signal(10);
  readonly currentPage = signal(0);
  readonly pageSizeOptions = [10, 20, 30];

  readonly loading = this.store.isLoading;
  readonly error = this.store.error;
  readonly allPlaylists = this.store.publicPlaylists;
  readonly hasPlaylists = this.store.hasPlaylists;

  readonly totalItems = computed(() => this.allPlaylists().length);
  readonly startIndex = computed(() => this.currentPage() * this.pageSize());
  readonly endIndex = computed(() => this.startIndex() + this.pageSize());
  readonly playlists = computed(() =>
    this.allPlaylists().slice(this.startIndex(), this.endIndex())
  );

  ngOnInit(): void {
    this.loadPlaylists();
  }

  onPlaylistPlay(playlist: FeaturedPlaylistContent): void {
    this.store.selectPlaylist(playlist);
  }

  onRetry(): void {
    this.store.clearError();
    this.loadPlaylists();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  private loadPlaylists(): void {
    this.store.loadPlaylists();
  }
}
