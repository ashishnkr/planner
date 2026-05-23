import React from 'react';
import { usePlannerStore } from '../store';
import { Droppable } from './DndWrappers';
import { format } from 'date-fns';
import { Calendar, Bell, Paperclip } from 'lucide-react';

export const NotesWidget = () => {
  const { selectedDate, notes, setNote, setSelectedDate } = usePlannerStore();
  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const content = notes[dateKey] || '';

  const handleChange = (e) => {
    setNote(dateKey, e.target.value);
  };

  const detectLinks = (text) => {
    const links = [];
    
    // Date links: [[YYYY-MM-DD]]
    const dateRegex = /\[\[\s*(\d{4}-\d{2}-\d{2})\s*\]\]/g;
    let match;
    while ((match = dateRegex.exec(text)) !== null) {
      links.push({ type: 'date', value: match[1], label: match[1] });
    }

    // Reminder links: [Reminder: Title @ Time]
    const reminderRegex = /\[Reminder: (.*?) @ (.*?)\]/g;
    while ((match = reminderRegex.exec(text)) !== null) {
      links.push({ type: 'reminder', value: match[1], label: match[1] + ' (' + match[2] + ')' });
    }

    // Attachment links: [Attachment: Name]
    const attachmentRegex = /\[Attachment: (.*?)\]/g;
    while ((match = attachmentRegex.exec(text)) !== null) {
      links.push({ type: 'attachment', value: match[1], label: match[1] });
    }

    return links;
  };

  const links = detectLinks(content);

  const handleLinkClick = (link) => {
    if (link.type === 'date') {
      const [y, m, d] = link.value.split('-').map(Number);
      setSelectedDate(new Date(y, m - 1, d));
    }
    // Add other behaviors if needed
  };

  return (
    <Droppable id='notes-droppable' data={{ type: 'notes' }} className='h-full'>
      <div className='p-4 bg-white rounded-lg shadow-md h-full flex flex-col'>
        <h2 className='text-xl font-bold mb-2'>Notes for {dateKey}</h2>
        <textarea
          className='flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent font-mono text-sm'
          placeholder='Type your notes here... (drag items here to link)'
          value={content}
          onChange={handleChange}
        />
        {links.length > 0 && (
          <div className='mt-4 overflow-x-auto'>
            <h3 className='font-semibold text-sm text-gray-500 mb-2'>Interconnected Items:</h3>
            <div className='flex gap-2 pb-2'>
              {links.map((link, i) => (
                <button
                  key={link.type + i}
                  onClick={() => handleLinkClick(link)}
                  className='flex items-center gap-1.5 whitespace-nowrap text-xs bg-gray-50 hover:bg-blue-50 text-blue-600 px-2 py-1.5 rounded-md border border-gray-100 transition-colors'
                >
                  {link.type === 'date' && <Calendar size={14} />}
                  {link.type === 'reminder' && <Bell size={14} />}
                  {link.type === 'attachment' && <Paperclip size={14} />}
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Droppable>
  );
};