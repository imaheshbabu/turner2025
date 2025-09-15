import { expect, test } from '@playwright/test';
import { PlaylistListPage } from '../pages/playlist-list-page';
import { PlaylistDetailPage } from '../pages/playlist-detail-page';

test.describe('Playlist Details', () => {
  let playlistListPage: PlaylistListPage;
  let playlistDetailPage: PlaylistDetailPage;

  test.beforeEach(async ({ page }) => {
    playlistListPage = new PlaylistListPage(page);
    playlistDetailPage = new PlaylistDetailPage(page);
  });

  test('should display playlist details for a valid playlist', async ({
    page,
  }) => {
    await playlistListPage.goto();
    await playlistListPage.waitForLoad();
    const count = await playlistListPage.getPlaylistCardCount();

    expect(count).toBeGreaterThan(0);
    if (count > 0) {
      const firstCard = await playlistListPage.getFirstPlaylistCard();

      await firstCard.click();
      await expect(page).toHaveURL(/\/playlists\//);
      await playlistDetailPage.waitForLoad();
      await expect(
        await playlistDetailPage.playlistName.isVisible()
      ).toBeTruthy();
      await expect(
        await playlistDetailPage.playlistDescription.isVisible()
      ).toBeTruthy();

      const imgVisible = await playlistDetailPage.playlistImage
        .isVisible()
        .catch(() => false);
      const placeholderVisible = await playlistDetailPage.imagePlaceholder
        .isVisible()
        .catch(() => false);

      expect(imgVisible || placeholderVisible).toBeTruthy();
      await expect(
        await playlistDetailPage.playlistStats.isVisible()
      ).toBeTruthy();
    }
  });

  test('should show loading indicator when navigating to playlist details', async ({
    page,
  }) => {
    playlistListPage = new PlaylistListPage(page);
    playlistDetailPage = new PlaylistDetailPage(page);
    await playlistListPage.goto();
    await playlistListPage.waitForLoad();
    const count = await playlistListPage.getPlaylistCardCount();

    expect(count).toBeGreaterThan(0);
    if (count > 0) {
      const firstCard = await playlistListPage.getFirstPlaylistCard();

      const [_] = await Promise.all([
        playlistDetailPage.waitForLoading(),
        firstCard.click(),
      ]);

      await playlistDetailPage.waitForLoad();
      await expect(
        await playlistDetailPage.playlistName.isVisible()
      ).toBeTruthy();
    }
  });
});
