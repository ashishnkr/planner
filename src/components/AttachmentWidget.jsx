import React from 'react';
import { usePlannerStore } from '../store';
import { Draggable } from './DndWrappers';
import { File, Paperclip, Trash2, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';

export const AttachmentWidget = () => {
  const { attachments, addAttachment, removeAttachment, updateAttachment, selectedDate } = usePlannerStore();
  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      addAttachment({
        name: file.name,
        path: file.path || file.name, // path is available in Electron
        type: file.type,
        size: file.size,
        dates: [dateKey],
        notes: []
      });
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAddNote = (id) => {
    const note = window.prompt('Enter a note for this attachment:');
    if (note) {
      const attachment = attachments.find(a => a.id === id);
      updateAttachment(id, { notes: [...attachment.notes, note] });
    }
  };

  return (
    <div 
      className='p-4 bg-white rounded-lg shadow-md h-full flex flex-col'
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <Paperclip size={24} className='text-green-500' />
          Attachment Repository
        </h2>
        <span className='text-xs text-gray-400'>Drop files to upload</span>
      </div>
      
      <div className='flex-grow overflow-auto'>
        {attachments.length === 0 ? (
          <div className='h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 italic'>
            No attachments yet. Drop files here.
          </div>
        ) : (
          <table className='w-full text-left'>
            <thead>
              <tr className='text-xs font-bold text-gray-500 border-b uppercase tracking-wider'>
                <th className='pb-3 px-2'>File Details</th>
                <th className='pb-3 px-2'>Linked Dates</th>
                <th className='pb-3 px-2'>Notes</th>
                <th className='pb-3 px-2 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {attachments.map(a => (
                <tr key={a.id} className='group hover:bg-gray-50 transition-colors'>
                  <td className='py-4 px-2'>
                    <Draggable id={'attachment-drag-' + a.id} data={{ type: 'attachment', attachment: a }}>
                      <div className='flex items-center gap-3 cursor-move'>
                        <div className='p-2 bg-green-50 rounded-lg text-green-600'>
                          <File size={18} />
                        </div>
                        <div className='flex flex-col'>
                          <span className='text-sm font-semibold text-gray-800 truncate max-w-[200px]' title={a.name}>
                            {a.name}
                          </span>
                          <span className='text-[10px] text-gray-400'>{(a.size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                    </Draggable>
                  </td>
                  <td className='py-4 px-2'>
                    <div className='flex flex-wrap gap-1'>
                      {a.dates.length > 0 ? a.dates.map(d => (
                        <span key={d} className='flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100'>
                          <Calendar size={10} /> {d}
                        </span>
                      )) : <span className='text-[10px] text-gray-300 italic'>None</span>}
                    </div>
                  </td>
                  <td className='py-4 px-2'>
                    <div className='max-w-[250px] space-y-1'>
                      {a.notes.length > 0 ? a.notes.map((n, i) => (
                        <div key={i} className='text-[10px] bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded border border-yellow-100 italic truncate'>
                          {n}
                        </div>
                      )) : <span className='text-[10px] text-gray-300 italic'>None</span>}
                      <button 
                        onClick={() => handleAddNote(a.id)}
                        className='text-[10px] text-blue-500 hover:underline flex items-center gap-1'
                      >
                        <FileText size={10} /> Add Note
                      </button>
                    </div>
                  </td>
                  <td className='py-4 px-2 text-right'>
                    <button 
                      onClick={() => removeAttachment(a.id)}
                      className='text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-2'
                      title='Delete attachment'
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};