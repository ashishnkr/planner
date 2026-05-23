# Planner

A modern, desktop-ready planner application built with React, Vite, and Electron. This application focuses on a seamless user experience with interactive widgets for calendars, notes, and reminders.

## 🚀 Features

- **Custom Title Bar**: A modern, VS Code-inspired title bar that integrates with the application's aesthetic.
- **Drag and Drop**: Robust drag-and-drop support using `@dnd-kit/core` for intuitive interaction between widgets.
- **Interactive Widgets**:
  - **Calendar**: Localized date handling and task tracking.
  - **Notes**: Quick access to persistent notes.
  - **Reminders**: Stay on top of your schedule.
- **Modern UI/UX**: Built with Tailwind CSS for a sleek, responsive design.

## 🛠️ Tech Stack

- **Frontend**: React (with Hooks & Functional Components)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library (95%+ coverage)
- **Platform**: Electron (integrated via custom main process)

## 📋 Best Practices

This project adheres to strict architectural and coding standards:

- **Date Handling**: Uses `yyyy-MM-dd` format consistently. Parses dates using local components to avoid UTC off-by-one errors.
- **Testing**: Enforces 95% code coverage. All components are tested in a `jsdom` environment with mocked stores and notifications.
- **UI Interaction**: Interactive elements use `-webkit-app-region: no-drag` to ensure proper click handling within the draggable title bar.

## ⚙️ Development

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ashishnkr/planner.git

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run coverage
```

## 📄 License

MIT
