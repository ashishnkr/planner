import React, { useEffect } from 'react';
import { CalendarWidget } from './components/CalendarWidget';
import { NotesWidget } from './components/NotesWidget';
import { RemindersWidget } from './components/RemindersWidget';
import { AttachmentWidget } from './components/AttachmentWidget';
import { TitleBar } from './components/TitleBar';
import { usePlannerStore } from './store';
import { format } from 'date-fns';
import { DndContext, pointerWithin } from '@dnd-kit/core';

function App() {
  const {
    reminders,
    appendNote,
    updateReminder,
    setSelectedDate,
    selectedDate,
    setNewReminderDate
  } = usePlannerStore();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    const dateKey = format(selectedDate, 'yyyy-MM-dd');

    // Logic: Drag Date to Notes
    if (activeData.type === 'day' && overData.type === 'notes') {
      appendNote(dateKey, '[[ ' + activeData.date + ' ]]');
    }

    // Logic: Drag Reminder to Notes
    if (activeData.type === 'reminder' && overData.type === 'notes') {
      const r = activeData.reminder;
      appendNote(dateKey, '[Reminder: ' + r.title + ' @ ' + r.time + ']');
    }

    // Logic: Drag Attachment to Notes
    if (activeData.type === 'attachment' && overData.type === 'notes') {
      const a = activeData.attachment;
      const { linkAttachmentToDate } = usePlannerStore.getState();
      appendNote(dateKey, '[Attachment: ' + a.name + ']');
      linkAttachmentToDate(a.id, dateKey);
    }

    // Logic: Drag Reminder to Calendar Date
    if (activeData.type === 'reminder' && overData.type === 'day') {
      updateReminder(activeData.reminder.id, { date: overData.date });
    }

    // Logic: Drag Calendar Date to Reminders Date Field
    if (activeData.type === 'day' && overData.type === 'reminder-date') {
      setNewReminderDate(activeData.date);
    }
  };

  useEffect(() => {
    if (window.Notification) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      const currentDate = format(now, 'yyyy-MM-dd');

      const dueReminders = reminders.filter(
        (r) => r.date === currentDate && r.time === currentTime
      );

      dueReminders.forEach((reminder) => {
        if (window.Notification && Notification.permission !== 'denied') {
          console.log('Triggering notification for:', reminder.title);
          new Notification('Reminders', {
            body: reminder.title + (reminder.location ? ' @ ' + reminder.location : ''),
            silent: false,
          });
        }
      });
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
      <div className='min-h-screen bg-gray-100 flex flex-col pt-8'>
        <TitleBar />
        <div className='flex-grow p-8'>
          <div className='max-w-7xl mx-auto'>
            <header className='mb-8'>
              <h1 className='text-3xl font-extrabold text-gray-900'>My Personal Planner</h1>
              <p className='text-gray-600'>Stay organized and interconnected.</p>
            </header>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              <div className='lg:col-span-1 space-y-8'>
                <CalendarWidget />
                <div className='hidden lg:block'>
                  <div className='p-4 bg-blue-50 rounded-lg border border-blue-100'>
                    <h3 className='font-semibold text-blue-800 mb-2'>Pro Tip</h3>
                    <p className='text-sm text-blue-600'>
                      Type [[YYYY-MM-DD]] in your notes to create a quick link to that day!
                      <br/>
                      Drag items between widgets to link them!
                    </p>
                  </div>
                </div>
              </div>

              <div className='lg:col-span-1 h-[600px]'>
                <NotesWidget />
              </div>

              <div className='lg:col-span-1 h-[600px]'>
                <RemindersWidget />
              </div>
            </div>

            <div className='mt-8 h-[400px]'>
              <AttachmentWidget />
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default App;