/** @vitest-environment jsdom */
import '../setupTests';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AttachmentWidget } from '../components/AttachmentWidget';
import { usePlannerStore } from '../store';

describe('AttachmentWidget', () => {
  it('renders correctly with no attachments', () => {
    usePlannerStore.setState({ attachments: [] });
    render(<AttachmentWidget />);
    expect(screen.getByText(/Drop files here or double-click/i)).toBeInTheDocument();
  });

  it('displays added attachments (Read)', () => {
    usePlannerStore.setState({
      attachments: [{
        id: 1,
        name: 'test.pdf',
        path: '/path/test.pdf',
        dates: ['2024-05-23'],
        notes: ['Important file'],
        size: 1024
      }]
    });
    render(<AttachmentWidget />);
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText('2024-05-23')).toBeInTheDocument();
    expect(screen.getByText('Important file')).toBeInTheDocument();
  });

  it('handles file drop (Create)', () => {
    usePlannerStore.setState({ attachments: [] });
    const { container } = render(<AttachmentWidget />);
    const dropZone = container.firstChild;

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const dropEvent = {
      dataTransfer: {
        files: [file],
        dropEffect: 'copy'
      }
    };

    fireEvent.drop(dropZone, dropEvent);

    const attachments = usePlannerStore.getState().attachments;
    expect(attachments).toHaveLength(1);
    expect(attachments[0].name).toBe('hello.png');
  });

  it('handles file selection via double click (Create)', () => {
    usePlannerStore.setState({ attachments: [] });
    const { container } = render(<AttachmentWidget />);
    const dropZone = container.firstChild;
    const input = container.querySelector('input[type="file"]');

    // Simulate double click to trigger input
    fireEvent.doubleClick(dropZone);
    
    // Simulate file selection
    const file = new File(['content'], 'upload.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });

    const attachments = usePlannerStore.getState().attachments;
    expect(attachments).toHaveLength(1);
    expect(attachments[0].name).toBe('upload.txt');
  });

  it('updates attachment note (Update)', () => {
    const attachment = {
      id: 123,
      name: 'note.txt',
      path: 'note.txt',
      dates: [],
      notes: [],
      size: 100
    };
    usePlannerStore.setState({ attachments: [attachment] });
    
    render(<AttachmentWidget />);
    
    // Mock window.prompt
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('A new note');
    
    const addNoteBtn = screen.getByText(/Add Note/i);
    fireEvent.click(addNoteBtn);
    
    expect(promptSpy).toHaveBeenCalled();
    const updatedAttachments = usePlannerStore.getState().attachments;
    expect(updatedAttachments[0].notes).toContain('A new note');
    
    promptSpy.mockRestore();
  });

  it('removes an attachment (Delete)', () => {
    const attachment = {
      id: 456,
      name: 'delete-me.jpg',
      path: 'delete-me.jpg',
      dates: [],
      notes: [],
      size: 500
    };
    usePlannerStore.setState({ attachments: [attachment] });
    
    render(<AttachmentWidget />);
    
    const deleteBtn = screen.getByTitle(/Delete attachment/i);
    fireEvent.click(deleteBtn);
    
    expect(usePlannerStore.getState().attachments).toHaveLength(0);
  });
});
