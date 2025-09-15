import { expect, test } from '@playwright/test';
import { PlaylistListPage } from '../pages/playlist-list-page';
import { PlaylistDetailPage } from '../pages/playlist-detail-page';

test.describe('Navigation and Routing', () => {
  let playlistListPage: PlaylistListPage;
  let playlistDetailPage: PlaylistDetailPage;

  test.beforeEach(async ({ page }) => {
    playlistListPage = new PlaylistListPage(page);
    playlistDetailPage = new PlaylistDetailPage(page);
  });

  test('should redirect root path to playlist list', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/playlists');
  });

  test('should display playlist list and cards', async () => {
    await playlistListPage.goto();
    await playlistListPage.waitForLoad();
    const count = await playlistListPage.getPlaylistCardCount();

    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to playlist detail from list', async ({ page }) => {
    await playlistListPage.goto();
    await playlistListPage.waitForLoad();
    const count = await playlistListPage.getPlaylistCardCount();

    if (count > 0) {
      const firstCard = await playlistListPage.getFirstPlaylistCard();

      await firstCard.click();
      await expect(page).toHaveURL(/\/playlists\//);
      await playlistDetailPage.waitForLoad();
      await expect(playlistDetailPage.playlistName).toBeVisible();
    }
  });

  test('should handle back and forward navigation', async ({ page }) => {
    await playlistListPage.goto();
    await playlistListPage.waitForLoad();
    const count = await playlistListPage.getPlaylistCardCount();

    if (count > 0) {
      const firstCard = await playlistListPage.getFirstPlaylistCard();

      await firstCard.click();
      await playlistDetailPage.waitForLoad();
      await page.goBack();
      await expect(page).toHaveURL('/playlists');
      await playlistListPage.waitForLoad();
      await page.goForward();
      await expect(page).toHaveURL(/\/playlists\//);
      await playlistDetailPage.waitForLoad();
    }
  });

  test('should show not-found page for invalid routes', async ({ page }) => {
    await page.goto('/invalid-route');
    await expect(page).toHaveURL('/not-found');

    const notFoundApp = page.locator('app-not-found');
    const notFoundDiv = page.locator('.not-found-content');

    await page.waitForTimeout(200);
    const appVisible = await notFoundApp.first().isVisible();
    const divVisible = await notFoundDiv.first().isVisible();

    expect(appVisible || divVisible).toBeTruthy();
  });

  test('should show not-found for non-existent playlist', async ({ page }) => {
    await page.goto('/playlists/non-existent-id');
    await page.waitForTimeout(1200);
    const notFoundCard = page.locator('.not-found-card');
    const cardVisible = await notFoundCard.first().isVisible();

    expect(cardVisible).toBeTruthy();
  });
});
