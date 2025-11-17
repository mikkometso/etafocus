# EtaFocus - Pomodoro & Todo Application

[![Deploy](https://github.com/mikkometso/etafocus/actions/workflows/deploy.yml/badge.svg)](https://github.com/mikkometso/etafocus/actions/workflows/deploy.yml)
[![Test](https://github.com/mikkometso/etafocus/actions/workflows/test.yml/badge.svg)](https://github.com/mikkometso/etafocus/actions/workflows/test.yml)

A modern Progressive Web Application combining Pomodoro timer functionality with an integrated todo list system.

🚀 **[Live Demo](https://mikkometso.github.io/etafocus/)**

## Tech Stack

- **React 18+** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** + **shadcn/ui** for styling
- **Vitest** for unit/integration testing
- **Playwright** for E2E testing
- **PWA** support with offline functionality

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Building

```bash
npm run build
```

### Testing

```bash
# Run unit tests
npm test

# Run unit tests with UI
npm run test:ui

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Linting

```bash
npm run lint
```

## Project Structure

See `claude.md` for detailed project structure and development guidelines.

## Features

### Current Features ✅
- **Pomodoro Timer**
  - Work sessions: 25 minutes (default)
  - Short breaks: 5 minutes (default)
  - Long breaks: 15 minutes (every 4 completed pomodoros)
  - Start/pause/reset/skip controls
  - Visual progress indicator
  - Session tracking and statistics
- **Quick Preset Badges**
  - Work sessions: 5, 10, 15, 25 minute presets
  - Break sessions: 5, 10, 15 minute presets
  - Dynamically switch based on current session type
  - One-click duration changes
- **Skip Session Functionality**
  - Skip any session (work or break) to move to the next
  - Skipping long break resets cycle to ensure next break is short
  - Respects auto-start settings
- **Auto-transitions** between work and break sessions
- **localStorage persistence** - your progress is saved
- **Light/dark theme** support
- **PWA support** - install as a native app
- **Responsive design** - works on all devices

### Planned Features 🚀
- Todo list with task tracking
- Link todos to pomodoro sessions
- Statistics and analytics dashboard
- Sound alerts and notifications
- Keyboard shortcuts

## Deployment

The app is automatically deployed to GitHub Pages on every push to the `main` branch.

- **Live URL**: https://mikkometso.github.io/etafocus/
- **CI/CD**: GitHub Actions
- **Tests**: Run automatically on PRs and before deployment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

All PRs are automatically tested before merge.

## License

MIT
