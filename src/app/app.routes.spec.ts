import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from './app.routes';

describe('App Routes', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should redirect empty path to /playlists', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/playlists');
  });

  it('should navigate to /playlists', async () => {
    await router.navigate(['/playlists']);
    expect(location.path()).toBe('/playlists');
  });

  it('should navigate to playlist detail with id', async () => {
    await router.navigate(['/playlists', '123']);
    expect(location.path()).toBe('/playlists/123');
  });

  it('should navigate to not-found page', async () => {
    await router.navigate(['/not-found']);
    expect(location.path()).toBe('/not-found');
  });

  it('should redirect unknown routes to not-found', async () => {
    await router.navigate(['/unknown-route']);
    expect(location.path()).toBe('/not-found');
  });

  it('should have correct route configuration', () => {
    expect(routes).toBeDefined();
    expect(routes.length).toBe(5);

    expect(routes[0].path).toBe('');
    expect(routes[0].redirectTo).toBe('/playlists');
    expect(routes[0].pathMatch).toBe('full');

    expect(routes[1].path).toBe('playlists');
    expect(routes[1].loadComponent).toBeDefined();

    expect(routes[2].path).toBe('playlists/:id');
    expect(routes[2].loadComponent).toBeDefined();

    expect(routes[3].path).toBe('not-found');
    expect(routes[3].loadComponent).toBeDefined();

    expect(routes[4].path).toBe('**');
    expect(routes[4].redirectTo).toBe('/not-found');
  });
});
