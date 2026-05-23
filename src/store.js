import { create } from 'zustand';
import { format } from 'date-fns';

export const usePlannerStore = create((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  newReminderDate: format(new Date(), 'yyyy-MM-dd'),
  setNewReminderDate: (date) => set({ newReminderDate: date }),
  notes: {}, // { 'YYYY-MM-DD': 'content' }
  setNote: (dateKey, content) => set((state) => ({
    notes: { ...state.notes, [dateKey]: content }
  })),
  appendNote: (dateKey, content) => set((state) => ({
    notes: {
      ...state.notes,
      [dateKey]: (state.notes[dateKey] ? state.notes[dateKey] + '\n' : '') + content
    }
  })),
  reminders: [], // [{ id, title, date, time, location }]
  addReminder: (reminder) => set((state) => ({
    reminders: [...state.reminders, { ...reminder, id: Date.now() }]
  })),
  updateReminder: (id, updates) => set((state) => ({
    reminders: state.reminders.map(r => r.id === id ? { ...r, ...updates } : r)
  })),
  removeReminder: (id) => set((state) => ({
    reminders: state.reminders.filter(r => r.id !== id)
  })),
}));
