/** @vitest-environment jsdom */
import '../setupTests';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from '../App';
import { usePlannerStore } from '../store';
import { format } from 'date-fns';

// Mock Notification
const mockNotification = vi.fn();
global.Notification = mockNotification;
global.Notification.permission = 'granted';

describe('App', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all main widgets and title bar menu', () => {
    render(<App />);
    expect(screen.getByText(/My Personal Planner/i)).toBeInTheDocument();
    expect(screen.getByText(/Notes for/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Reminders/i })).toBeInTheDocument();
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('triggers notification when reminder time matches', () => {
    const now = new Date();
    const timeStr = format(now, 'HH:mm');
    const dateStr = format(now, 'yyyy-MM-dd');

    usePlannerStore.setState({
      reminders: [{ id: 1, title: 'Alert', date: dateStr, time: timeStr }]
    });

    render(<App />);

    expect(mockNotification).toHaveBeenCalledWith('Reminders', expect.objectContaining({
      body: expect.stringContaining('Alert')
    }));
  });
});
