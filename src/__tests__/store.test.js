import { describe, it, expect, beforeEach } from 'vitest';
import { usePlannerStore } from '../store';

describe('Planner Store', () => {
  beforeEach(() => {
    usePlannerStore.setState({ 
      selectedDate: new Date('2024-01-01'),
      notes: {},
      reminders: []
    });
  });

  it('updates the selected date', () => {
    const newDate = new Date('2024-05-23');
    usePlannerStore.getState().setSelectedDate(newDate);
    expect(usePlannerStore.getState().selectedDate).toEqual(newDate);
  });

  it('updates the new reminder date', () => {
    const dateStr = '2024-06-01';
    usePlannerStore.getState().setNewReminderDate(dateStr);
    expect(usePlannerStore.getState().newReminderDate).toBe(dateStr);
  });

  it('sets and updates notes', () => {
    const dateKey = '2024-05-23';
    const content = 'Test Note';
    usePlannerStore.getState().setNote(dateKey, content);
    expect(usePlannerStore.getState().notes[dateKey]).toBe(content);
  });

  it('appends to notes', () => {
    const dateKey = '2024-05-23';
    usePlannerStore.getState().setNote(dateKey, 'Initial');
    usePlannerStore.getState().appendNote(dateKey, 'Appended');
    expect(usePlannerStore.getState().notes[dateKey]).toBe('Initial\nAppended');
  });

  it('adds and removes reminders', () => {
    const reminder = { title: 'Test Reminder', date: '2024-05-23', time: '10:00' };
    usePlannerStore.getState().addReminder(reminder);
    const state = usePlannerStore.getState();
    expect(state.reminders.length).toBe(1);
    
    const reminderId = state.reminders[0].id;
    usePlannerStore.getState().updateReminder(reminderId, { title: 'Updated' });
    expect(usePlannerStore.getState().reminders[0].title).toBe('Updated');

    usePlannerStore.getState().removeReminder(reminderId);
    expect(usePlannerStore.getState().reminders.length).toBe(0);
  });
});
