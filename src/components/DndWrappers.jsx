import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';

export function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: props.id,
    data: props.data,
  });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    pointerEvents: isDragging ? 'auto' : 'none',
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={props.className}>
      <div style={{ pointerEvents: 'auto', height: '100%', width: '100%' }}>
        {props.children}
      </div>
    </div>
  );
}

export function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
    data: props.data,
  });
  const style = {
    backgroundColor: isOver ? '#ebf8ff' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className={props.className}>
      {props.children}
    </div>
  );
}
