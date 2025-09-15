import { expect, Locator, Page } from '@playwright/test';

export class PlaylistDetailPage {
  readonly page: Page;
  readonly playlistDetail: Locator;
  readonly backButton: Locator;
  readonly playlistName: Locator;
  readonly playlistDescription: Locator;
  readonly playlistImage: Locator;
  readonly imagePlaceholder: Locator;
  readonly playlistStats: Locator;
  readonly tagsSection: Locator;
  readonly privacyIndicator: Locator;
  readonly loadingComponent: Locator;
  readonly errorComponent: Locator;
  readonly notFoundMessage: Locator;
  readonly retryButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.playlistDetail = page.locator('.playlist-detail-container');
    this.backButton = page.locator('.back-button');
    this.playlistName = page.locator('.playlist-title');
    this.playlistDescription = page.locator('.playlist-description');
    this.playlistImage = page.locator('.playlist-image img');
    this.imagePlaceholder = page.locator('.image-placeholder');
    this.playlistStats = page.locator('.playlist-stats');
    this.tagsSection = page.locator('.tags-section');
    this.privacyIndicator = page
      .locator('.stat-item')
      .filter({ hasText: /Private|Public/ })
      .last();
    this.loadingComponent = page.locator('app-loading');
    this.errorComponent = page.locator('app-error');
    this.notFoundMessage = page.locator('.not-found-content h2');
    this.retryButton = page
      .locator('button')
      .filter({ hasText: /Try Again|Retry/ });
  }

  async waitForLoad() {
    await expect(this.playlistDetail).toBeVisible();
    await expect(this.playlistName).toBeVisible();
  }

  async waitForLoading() {
    await expect(this.loadingComponent).toBeVisible();
  }
}
