
# Playlist Display App

A modern Angular 18 application for displaying and browsing music playlists with a clean, responsive design.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:4200/
```

## Available Scripts

### Development
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode

### Testing
- `npm test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run e2e` - Run end-to-end tests
- `npm run e2e:ui` - Run e2e tests with UI

### Code Quality
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Playlist Cards**: Clean card-based layout with hover effects
- **Detail Views**: Click any playlist to see full details
- **Loading States**: Smooth loading indicators and error handling
- **Accessibility**: Full keyboard navigation and screen reader support

## Tech Stack

- **Angular 18** with standalone components
- **Angular Material** for UI components
- **@ngrx/signals** for state management
- **SCSS** with organized architecture
- **Playwright** for E2E testing
- **TypeScript** with strict mode

## Development Notes

### Successes ✅
- **Angular 18 Features**: New control flow syntax (`@if`, `@for`) and standalone components made the code much cleaner
- **Signal Store**: `@ngrx/signals` was intuitive and required way less boilerplate than traditional NgRx

### Improvements


1) we can add the [MSW](https://mswjs.io/) library to mock HTTP requests at the network level. This decouples mock data from the Angular PlaylistService, so you don't need to reference mock data directly in the service code. Instead, MSW intercepts requests and returns mock responses, making the tests and development environment more realistic and maintainable.
2) we can use MSW to mock error and retry scenarios.
3) User authentication

### Key Decisions 
- **Standalone over Modules**: Better tree-shaking and simpler imports for this app size
- **Signals over RxJS**: Simpler mental model for basic state management without the complexity
- **signalStore** for state management due to its simplicity and reduced boilerplate compared to traditional NgRx.
