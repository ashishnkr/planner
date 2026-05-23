import React from 'react';
import { usePlannerStore } from '../store';
import { Droppable } from './DndWrappers';
import { format } from 'date-fns';

export const NotesWidget = () => {
  const { selectedDate, notes, setNote, setSelectedDate } = usePlannerStore();
  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const content = notes[dateKey] || '';

  const handleChange = (e) => {
    setNote(dateKey, e.target.value);
  };

  const detectDates = (text) => {
    const regex = /\[\[(\d{4}-\d{2}-\d{2})\]\]/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  };

  const foundDates = detectDates(content);

  return (
    <Droppable id='notes-droppable' data={{ type: 'notes' }} className='h-full'>
      <div className='p-4 bg-white rounded-lg shadow-md h-full flex flex-col'>
        <h2 className='text-xl font-bold mb-2'>Notes for {dateKey}</h2>
        <textarea
          className='flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent'
          placeholder='Type your notes here... (use [[YYYY-MM-DD]] to link)'
          value={content}
          onChange={handleChange}
        />
        {foundDates.length > 0 && (
          <div className='mt-4'>
            <h3 className='font-semibold'>Links found:</h3>
            <div className='flex flex-wrap gap-2'>
              {foundDates.map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    const [y, m, d] = date.split('-').map(Number);
                    setSelectedDate(new Date(y, m - 1, d));
                  }}
                  className='text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded-md'
                >
                  {date}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Droppable>
  );
};
