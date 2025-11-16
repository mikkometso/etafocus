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
  - 25-minute work sessions
  - 5-minute short breaks
  - 15-minute long breaks (every 4 pomodoros)
  - Start/pause/reset controls
  - Visual progress indicator
  - Session tracking and statistics
- **Auto-transitions** between work and break sessions
- **localStorage persistence** - your progress is saved
- **Light/dark theme** support
- **PWA support** - install as a native app
- **Responsive design** - works on all devices

### Planned Features 🚀
- Todo list with task tracking
- Link todos to pomodoro sessions
- Customizable timer durations
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
