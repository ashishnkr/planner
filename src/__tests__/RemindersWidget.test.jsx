/** @vitest-environment jsdom */
import '../setupTests';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RemindersWidget } from '../components/RemindersWidget';
import { usePlannerStore } from '../store';

describe('RemindersWidget', () => {
  it('renders reminders for the selected date', () => {
    const dateKey = '2024-05-23';
    usePlannerStore.setState({ 
      selectedDate: new Date(dateKey),
      reminders: [{ id: 1, title: 'Meeting', date: dateKey, time: '10:00' }]
    });
    render(<RemindersWidget />);
    expect(screen.getByText('Meeting')).toBeInTheDocument();
  });

  it('adds a new reminder', () => {
    usePlannerStore.setState({ 
      selectedDate: new Date('2024-05-23'),
      newReminderDate: '2024-05-25'
    });
    render(<RemindersWidget />);

    const input = screen.getByPlaceholderText(/Add reminder/i);
    const timeInput = screen.getByLabelText(/Time/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const addBtn = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Gym' } });
    fireEvent.change(timeInput, { target: { value: '18:00' } });
    fireEvent.change(dateInput, { target: { value: '2024-05-26' } });
    fireEvent.click(addBtn);

    const reminders = usePlannerStore.getState().reminders;
    expect(reminders.some(r => r.title === 'Gym' && r.date === '2024-05-26')).toBe(true);
  });
  it('deletes a reminder', () => {
    const dateKey = '2024-05-23';
    usePlannerStore.setState({ 
      selectedDate: new Date(dateKey),
      reminders: [{ id: 1, title: 'Meeting', date: dateKey, time: '10:00' }]
    });
    render(<RemindersWidget />);
    
    const deleteBtn = screen.getByLabelText(/delete/i);
    fireEvent.click(deleteBtn);
    
    expect(usePlannerStore.getState().reminders.length).toBe(0);
  });
});
