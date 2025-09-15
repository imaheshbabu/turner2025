import { expect, Locator, Page } from '@playwright/test';

export class PlaylistListPage {
  readonly page: Page;
  readonly playlistGrid: Locator;
  readonly pageTitle: Locator;
  readonly pageSubtitle: Locator;
  readonly loadingComponent: Locator;
  readonly errorComponent: Locator;
  readonly emptyState: Locator;
  readonly playlistCards: Locator;
  readonly retryButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.playlistGrid = page.locator('.playlist-grid');
    this.pageTitle = page.locator('h1');
    this.pageSubtitle = page.locator('.subtitle');
    this.loadingComponent = page.locator('app-loading');
    this.errorComponent = page.locator('app-error');
    this.emptyState = page.locator('.empty-state');
    this.playlistCards = page.locator('app-playlist-card');
    this.retryButton = page
      .locator('button')
      .filter({ hasText: /Try Again|Retry/ });
  }

  async goto() {
    await this.page.goto('/playlists');
  }

  async waitForLoad() {
    await expect(this.playlistGrid).toBeVisible();
  }

  async waitForLoading() {
    await expect(this.loadingComponent).toBeVisible();
  }

  async getPlaylistCardCount(): Promise<number> {
    return await this.playlistCards.count();
  }

  async getFirstPlaylistCard(): Promise<Locator> {
    return this.playlistCards.first();
  }
}
