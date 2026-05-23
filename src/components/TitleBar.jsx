import React from 'react';
import { Calendar } from 'lucide-react';

export const TitleBar = () => {
  const menuItems = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'];

  return (
    <div
      className='h-8 bg-[#1e1e1e] text-[#cccccc] flex items-center px-2 select-none fixed top-0 left-0 right-0 z-50 text-sm'
      style={{ WebkitAppRegion: 'drag' }}
    >
      <div className='flex items-center gap-2 px-2 mr-2' style={{ WebkitAppRegion: 'no-drag' }}>
        <Calendar size={16} className='text-blue-400' />
      </div>

      <div className='flex items-center' style={{ WebkitAppRegion: 'no-drag' }}>
        {menuItems.map((item) => (
          <button
            key={item}
            className='px-3 py-1 hover:bg-[#333333] rounded-md transition-colors cursor-default'
          >
            {item}
          </button>
        ))}
      </div>

      <div className='flex-grow text-center text-xs opacity-80'>
        Planner - My Personal Workspace
      </div>

      <div className='w-[100px]' /> {/* Spacer for window controls if any */}
    </div>
  );
};
