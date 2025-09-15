import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/playlists',
    pathMatch: 'full',
  },
  {
    path: 'playlists',
    loadComponent: () =>
      import(
        './features/playlists/components/playlist-list/playlist-list.component'
      ).then(m => m.PlaylistListComponent),
  },
  {
    path: 'playlists/:id',
    loadComponent: () =>
      import(
        './features/playlists/components/playlist-detail/playlist-detail.component'
      ).then(m => m.PlaylistDetailComponent),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(
        m => m.NotFoundComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/not-found',
  },
];
