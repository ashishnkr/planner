/** @vitest-environment jsdom */
import '../setupTests';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AttachmentWidget } from '../components/AttachmentWidget';
import { usePlannerStore } from '../store';

describe('AttachmentWidget', () => {
  it('renders correctly with no attachments', () => {
    usePlannerStore.setState({ attachments: [] });
    render(<AttachmentWidget />);
    expect(screen.getByText(/No attachments yet/i)).toBeInTheDocument();
  });

  it('displays added attachments', () => {
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
});