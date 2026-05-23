/** @vitest-environment jsdom */
import '../setupTests';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CalendarWidget } from '../components/CalendarWidget';
import { usePlannerStore } from '../store';
import { format, addMonths, subMonths } from 'date-fns';

describe('CalendarWidget', () => {
  it('renders days of the current month', () => {
    usePlannerStore.setState({ selectedDate: new Date('2024-05-23') });
    render(<CalendarWidget />);
    expect(screen.getByText('23')).toBeInTheDocument();
  });

  it('updates selected date on double clicking a day', () => {
    usePlannerStore.setState({ selectedDate: new Date('2024-05-23') });
    render(<CalendarWidget />);
    const day10 = screen.getByText('10');
    fireEvent.doubleClick(day10);
    expect(usePlannerStore.getState().selectedDate.getDate()).toBe(10);
  });

  it('navigates to next and previous months', () => {
    const initialDate = new Date('2024-05-23');
    usePlannerStore.setState({ selectedDate: initialDate });
    render(<CalendarWidget />);
    
    const prevMonthBtn = screen.getAllByRole('button')[0];
    const nextMonthBtn = screen.getAllByRole('button')[1];

    fireEvent.click(nextMonthBtn);
    expect(screen.getByText(format(addMonths(initialDate, 1), 'MMMM yyyy'))).toBeInTheDocument();

    fireEvent.click(prevMonthBtn);
    expect(screen.getByText(format(initialDate, 'MMMM yyyy'))).toBeInTheDocument();
  });

  it('displays indicators for notes and reminders', () => {
    const dateKey = '2024-05-23';
    usePlannerStore.setState({ 
      selectedDate: new Date(dateKey),
      notes: { [dateKey]: 'Some note' },
      reminders: [{ id: 1, title: 'Meeting', date: dateKey }]
    });
    const { container } = render(<CalendarWidget />);
    
    // Check if the dots exist
    const dots = container.querySelectorAll('.w-1.h-1');
    expect(dots.length).toBe(2);
  });
});
