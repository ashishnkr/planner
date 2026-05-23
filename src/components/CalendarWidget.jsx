import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { usePlannerStore } from '../store';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Draggable, Droppable } from './DndWrappers';

export const CalendarWidget = () => {
  const { selectedDate, setSelectedDate, notes, reminders, setNewReminderDate } = usePlannerStore();
  const [currentMonth, setCurrentMonth] = React.useState(startOfMonth(selectedDate));

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className='p-4 bg-white rounded-lg shadow-md'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold'>{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className='flex gap-2'>
          <button onClick={prevMonth} className='p-1 hover:bg-gray-100 rounded'><ChevronLeft size={20}/></button>
          <button onClick={nextMonth} className='p-1 hover:bg-gray-100 rounded'><ChevronRight size={20}/></button>
        </div>
      </div>
      <div className='grid grid-cols-7 gap-1 text-center font-semibold text-gray-500 mb-2'>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className='grid grid-cols-7 gap-1'>
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const hasNote = !!notes[dateKey];
          const hasReminder = reminders.some(r => r.date === dateKey);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <div key={day.toString()} className='h-10'>
              <Droppable id={`day-drop-${dateKey}`} data={{ type: 'day', date: dateKey }} className='w-full h-full'>
                <Draggable id={`day-drag-${dateKey}`} data={{ type: 'day', date: dateKey }} className='w-full h-full'>
                  <button
                    onPointerDown={() => {
                      setSelectedDate(day);
                      setNewReminderDate(dateKey);
                    }}
                    className={`
                      w-full h-full flex flex-col items-center justify-center rounded-md transition-colors relative
                      ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                      ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}
                    `}
                  >
                    <span className='text-sm'>{format(day, 'd')}</span>
                    <div className='flex gap-0.5 mt-0.5'>
                      {hasNote && <div className='w-1 h-1 bg-yellow-400 rounded-full'></div>}
                      {hasReminder && <div className='w-1 h-1 bg-red-400 rounded-full'></div>}
                    </div>
                  </button>
                </Draggable>
              </Droppable>
            </div>
          );
        })}
      </div>
    </div>
  );
};
