import { expect, test } from '@playwright/test';
import { PlaylistListPage } from '../pages/playlist-list-page';

test.describe('Playlist List', () => {
  let playlistListPage: PlaylistListPage;

  test.beforeEach(async ({ page }) => {
    playlistListPage = new PlaylistListPage(page);
  });

  test('should display all playlist cards', async () => {
    await playlistListPage.goto();
    await playlistListPage.waitForLoad();
    const count = await playlistListPage.getPlaylistCardCount();

    expect(count).toBeGreaterThan(0);
  });

  test('should show loading indicator while loading', async () => {
    await playlistListPage.goto();
    await playlistListPage.waitForLoading();
    await expect(playlistListPage.loadingComponent).toBeVisible();
  });

  test('should not show error or empty state when playlists exist', async () => {
    await playlistListPage.goto();
    await playlistListPage.waitForLoad();
    await expect(playlistListPage.errorComponent).not.toBeVisible();
    await expect(playlistListPage.emptyState).not.toBeVisible();
  });
});
