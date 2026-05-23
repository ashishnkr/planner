import React, { useState } from 'react';
import { format } from 'date-fns';
import { usePlannerStore } from '../store';
import { Trash2, Plus, Bell } from 'lucide-react';
import { Draggable, Droppable } from './DndWrappers';

export const RemindersWidget = () => {
  const { 
    selectedDate, 
    reminders, 
    addReminder, 
    removeReminder, 
    newReminderDate, 
    setNewReminderDate 
  } = usePlannerStore();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('12:00');
  const [location, setLocation] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addReminder({ title, date: newReminderDate, time, location });
    setTitle('');
    setLocation('');
  };

  return (
    <div className='p-4 bg-white rounded-lg shadow-md h-full flex flex-col'>
      <h2 className='text-xl font-bold mb-4 flex items-center gap-2'>
        <Bell size={24} className='text-blue-500' />
        Reminders
      </h2>

      <form onSubmit={handleAdd} className='mb-4 space-y-2'>
        <input
          type='text'
          placeholder='Add reminder...'
          className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className='flex gap-2'>
          <div className='flex-1'>
            <label htmlFor='time' className='text-xs text-gray-500'>Time</label>
            <input
              id='time'
              type='time'
              className='w-full p-2 border rounded-md'
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className='flex-1'>
            <Droppable id='reminder-date-drop' data={{ type: 'reminder-date' }}>
              <label htmlFor='reminder-date' className='text-xs text-gray-500'>Date</label>
              <input
                id='reminder-date'
                type='date'
                className='w-full p-2 border rounded-md'
                value={newReminderDate}
                onChange={(e) => setNewReminderDate(e.target.value)}
              />
            </Droppable>
          </div>
        </div>
        <div className='flex-1'>
          <label htmlFor='location' className='text-xs text-gray-500'>Location (optional)</label>
          <input
            id='location'
            type='text'
            placeholder='e.g. Office'
            className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2'
        >
          <Plus size={20} /> Add
        </button>
      </form>

      <div className='flex-grow overflow-y-auto space-y-2'>
        {reminders.filter(r => r.date === format(selectedDate, 'yyyy-MM-dd')).length === 0 ? (
          <p className='text-gray-500 text-center italic'>No reminders for this day.</p>
        ) : (
          reminders.filter(r => r.date === format(selectedDate, 'yyyy-MM-dd')).map((reminder) => (            <Draggable key={reminder.id} id={`reminder-drag-${reminder.id}`} data={{ type: 'reminder', reminder }}>
              <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg group'>
                <div>
                  <p className='font-semibold text-gray-800'>{reminder.title}</p>
                  <div className='flex gap-2 text-xs text-gray-500'>
                    <span>{reminder.time}</span>
                    {reminder.location && <span>@ {reminder.location}</span>}
                  </div>
                </div>
                <button
                  aria-label='delete'
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeReminder(reminder.id);
                  }}
                  className='text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </Draggable>
          ))
        )}
      </div>
    </div>
  );
};
