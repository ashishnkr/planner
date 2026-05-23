/** @vitest-environment jsdom */
import '../setupTests';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NotesWidget } from '../components/NotesWidget';
import { usePlannerStore } from '../store';
import { format } from 'date-fns';

describe('NotesWidget', () => {
  it('updates the note content in the store on change', () => {
    render(<NotesWidget />);
    const textarea = screen.getByPlaceholderText(/Type your notes here/i);
    fireEvent.change(textarea, { target: { value: 'Buy milk' } });

    const dateKey = format(usePlannerStore.getState().selectedDate, 'yyyy-MM-dd');
    expect(usePlannerStore.getState().notes[dateKey]).toBe('Buy milk');
  });

  it('detects and displays clickable dates', () => {
    render(<NotesWidget />);
    const textarea = screen.getByPlaceholderText(/Type your notes here/i);
    fireEvent.change(textarea, { target: { value: 'See you on [[2024-12-25]]' } });

    const dateLink = screen.getByText('2024-12-25');
    expect(dateLink).toBeInTheDocument();

    fireEvent.click(dateLink);
    expect(format(usePlannerStore.getState().selectedDate, 'yyyy-MM-dd')).toBe('2024-12-25');
  });
});
