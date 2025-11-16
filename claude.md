# EtaFocus - Pomodoro & Todo Application

## Project Overview

**EtaFocus** is a modern, Progressive Web Application combining Pomodoro timer functionality with an integrated todo list system. The application helps users manage their time and tasks effectively using the Pomodoro Technique.

### Key Capabilities
- Pomodoro timer with classic and custom intervals
- Integrated todo list with task tracking
- PWA with offline support
- Light/dark theme
- Statistics and analytics
- Sound alerts and notifications

---

## Tech Stack

### Core Technologies
- **Frontend Framework**: React 18+
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite 5+
- **Styling**: Tailwind CSS 3+
- **UI Components**: shadcn/ui
- **State Management**: React Context API (with potential for Zustand/Redux migration)

### Testing
- **Unit/Integration Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright
- **Coverage Goal**: 80% minimum for critical paths

### PWA & Storage
- **PWA Plugin**: vite-plugin-pwa
- **Service Worker**: Workbox
- **Storage**: localStorage (with abstraction layer for future backend)

### Code Quality
- **Linting**: ESLint 9+ with TypeScript parser
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged

---

## Project Structure

```
etafocus/
├── public/
│   ├── icons/              # PWA icons (various sizes)
│   ├── sounds/             # Notification sounds
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   ├── pomodoro/       # Pomodoro-specific components
│   │   ├── todos/          # Todo-specific components
│   │   ├── statistics/     # Statistics components
│   │   └── layout/         # Layout components (Header, Footer, etc.)
│   ├── features/
│   │   ├── pomodoro/
│   │   │   ├── hooks/
│   │   │   ├── context/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   ├── todos/
│   │   │   ├── hooks/
│   │   │   ├── context/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   ├── theme/
│   │   └── analytics/
│   ├── hooks/              # Shared custom hooks
│   ├── lib/
│   │   ├── storage/        # localStorage abstraction
│   │   ├── notifications/  # Browser notifications
│   │   └── audio/          # Sound management
│   ├── types/              # Global TypeScript types
│   ├── utils/              # Utility functions
│   ├── constants/          # App constants
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .github/
│   └── workflows/          # CI/CD workflows
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── playwright.config.ts
├── vitest.config.ts
└── package.json
```

---

## Core Features Specification

### 1. Pomodoro Timer

#### Timer Modes
- **Classic Mode**: 25min work, 5min short break, 15min long break (every 4 pomodoros)
- **Custom Mode**: User-configurable intervals

#### Timer States
- `idle` - Timer not started
- `running` - Timer actively counting down
- `paused` - Timer paused by user
- `completed` - Timer finished

#### Features
- Start/pause/reset controls
- Visual progress indicator
- Sound alerts on completion (configurable)
- Browser notifications (with permission)
- Auto-start next session (configurable)
- Skip current session
- Session counter (pomodoros completed today)

#### Settings
- Work duration (1-60 minutes)
- Short break duration (1-30 minutes)
- Long break duration (5-60 minutes)
- Long break interval (2-10 pomodoros)
- Auto-start next session (boolean)
- Sound alerts (boolean)
- Notification alerts (boolean)
- Sound selection

### 2. Todo List

#### Todo Item Structure
```typescript
type Todo = {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  category?: string
  completed: boolean
  pomodorosEstimated: number
  pomodorosCompleted: number
  createdAt: Date
  completedAt?: Date
  linkedPomodoroSessions: string[]
}
```

#### Features
- Create/read/update/delete todos
- Mark as complete/incomplete
- Priority levels (low, medium, high)
- Categories/tags
- Estimate pomodoros needed
- Track pomodoros spent on task
- Link active todo to current pomodoro session
- Filter by status, priority, category
- Sort by priority, date, pomodoros
- Search functionality

### 3. Statistics & Analytics

#### Metrics to Track
- Total pomodoros completed (all-time, today, this week, this month)
- Total focus time
- Completion rate
- Average pomodoros per day
- Most productive time of day
- Category breakdown
- Streak tracking (consecutive days)

#### Visualizations
- Daily/weekly/monthly charts
- Category distribution pie chart
- Productivity heatmap
- Focus time trends

### 4. Theme System

#### Themes
- Light mode
- Dark mode
- System preference detection
- Smooth transitions between themes

#### Implementation
- Use Tailwind's dark mode with class strategy
- Persist preference in localStorage
- Sync with shadcn/ui theming

### 5. Notifications & Sounds

#### Sound Alerts
- Work session complete
- Break complete
- Optional tick sound during work
- User-selectable sound packs

#### Browser Notifications
- Request permission on first use
- Show notification on session completion
- Include next session info
- Work in background/minimized

---

## Development Guidelines

### TypeScript Standards

#### Type Safety
- **Strict mode enabled**: All TypeScript strict flags on
- **No `any` types**: Use `unknown` and type guards when necessary
- **Prefer `type` over `interface`**: Use `interface` only for public APIs that may need extension

```typescript
// GOOD
type User = {
  id: string
  name: string
}

type AdminUser = User & {
  permissions: string[]
}

// AVOID (unless needed for extension)
interface User {
  id: string
  name: string
}
```

#### Naming Conventions
- **Types/Interfaces**: PascalCase (`TodoItem`, `PomodoroState`)
- **Components**: PascalCase (`TodoList`, `PomodoroTimer`)
- **Hooks**: camelCase with `use` prefix (`useTodos`, `usePomodoro`)
- **Utils/Functions**: camelCase (`formatTime`, `calculateProgress`)
- **Constants**: SCREAMING_SNAKE_CASE (`DEFAULT_WORK_DURATION`, `MAX_POMODOROS`)
- **Files**: kebab-case (`pomodoro-timer.tsx`, `use-todos.ts`)

### Component Patterns

#### Component Structure
```typescript
// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Todo } from '@/types/todo'

// 2. Types
type TodoItemProps = {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

// 3. Component
export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  // Hooks first
  const [isEditing, setIsEditing] = useState(false)

  // Event handlers
  const handleToggle = () => {
    onToggle(todo.id)
  }

  // Render
  return (
    // JSX
  )
}
```

#### Hooks Usage
- Keep hooks at the top of components
- Extract complex logic into custom hooks
- Use `useMemo` and `useCallback` for expensive computations and stable references

### Code Organization

#### File Naming
- Components: `component-name.tsx`
- Hooks: `use-hook-name.ts`
- Utils: `util-name.ts`
- Types: `type-name.ts`
- Tests: `component-name.test.tsx` or `util-name.test.ts`

#### Import Order
1. React/external libraries
2. Internal components
3. Internal hooks
4. Utils/helpers
5. Types
6. Constants
7. Styles

### Testing Requirements

#### Unit Tests (Vitest)
- All utility functions must have tests
- All custom hooks must have tests
- Aim for 80%+ coverage on utils and hooks

#### Component Tests
- Test user interactions
- Test different states
- Test accessibility
- Test error states

#### E2E Tests (Playwright)
- Critical user flows:
  - Complete a pomodoro session
  - Create and complete a todo
  - Link todo to pomodoro
  - View statistics
  - Toggle theme

### Accessibility Standards

- **WCAG 2.1 Level AA compliance**
- Semantic HTML elements
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Color contrast ratios (4.5:1 minimum)
- Screen reader testing

### Analytics Guidelines

#### Event Tracking
Every user interaction should be tracked with descriptive event names.

**DO NOT do this:**
- Add new features without analytics
- Modify features without updating events
- Use generic event names like "button_clicked"
- Forget to test events

**DO this:**
- Plan analytics events during feature design
- Update event names when behavior changes
- Use specific, descriptive event names
- Test events thoroughly during development

#### Event Naming Convention
```typescript
// Pattern: [category]_[action]_[target]
'pomodoro_started_work_session'
'pomodoro_completed_break_session'
'todo_created_with_priority'
'todo_linked_to_pomodoro'
'settings_updated_timer_duration'
'theme_toggled_to_dark'
```

---

## Git Workflow Requirements

### CRITICAL: Branch Strategy

**IMPORTANT**: You MUST follow this Git workflow for ALL code changes.

1. **ALWAYS create a feature branch before making changes**
   ```bash
   git checkout -b feature/[feature-name]
   # or
   git checkout -b fix/[bug-name]
   ```

2. **NEVER work directly on main branch**
   - All changes must go through feature branches
   - Main branch should always be deployable

3. **Commit changes REGULARLY during development**
   - After completing each major step
   - When switching between different files/features
   - Before starting a risky refactor

4. **Commit message format**
   ```bash
   git commit -m "[Type] Brief description

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

   **Types:**
   - `[Feature]` - New feature
   - `[Fix]` - Bug fix
   - `[Refactor]` - Code refactoring
   - `[Test]` - Adding tests
   - `[Docs]` - Documentation
   - `[Style]` - Formatting, styling
   - `[Chore]` - Maintenance tasks

5. **DO NOT push to remote without consent**
   - Always ask before pushing
   - Never force push to main

---

## PWA Requirements

### Manifest Configuration
```json
{
  "name": "EtaFocus - Pomodoro & Todo",
  "short_name": "EtaFocus",
  "description": "Productivity app combining Pomodoro timer with todo list",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/",
  "icons": [...]
}
```

### Service Worker Strategy
- **Precache**: App shell, core assets, fonts
- **Runtime cache**: API responses (when backend added)
- **Network first**: HTML pages
- **Cache first**: Static assets (images, fonts, CSS, JS)

### Offline Functionality
- All core features work offline
- Data persists in localStorage
- Sync data when back online (future)
- Show offline indicator in UI

### Install Prompts
- Detect if app is installable
- Show custom install prompt after user engagement
- Handle install/dismiss events

---

## Performance Goals

- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Lighthouse Score**: 90+ in all categories

### Optimization Strategies
- Code splitting by route
- Lazy loading for statistics page
- Optimize images and icons
- Tree-shaking unused code
- Minimize bundle size

---

## Security Considerations

- Sanitize user inputs (todo titles, descriptions)
- Content Security Policy headers
- No sensitive data in localStorage (future: encrypt if needed)
- HTTPS only in production
- Regular dependency audits

---

## Future Considerations

### Potential Features
- Backend API with user accounts
- Data sync across devices
- Collaborative todos
- Recurring tasks
- Calendar integration
- Export data (JSON, CSV)
- Import from other apps

### Potential Tech Migrations
- Context → Zustand/Redux (if state becomes complex)
- localStorage → IndexedDB (for larger datasets)
- Add tRPC or GraphQL for backend communication

---

## Getting Started

See `README.md` for installation and setup instructions.

---

*This document serves as a comprehensive reference for AI assistants and developers working on EtaFocus.*