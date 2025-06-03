'use client';

import { useDraggable } from '@dnd-kit/core';

export default function DraggableItem({ id, label, type }: { id: string; label: string; type: string }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: {
      label,
      type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: '10px',
        marginBottom: '8px',
        border: '1px solid #ccc',
        backgroundColor: '#f7f7f7',
        cursor: 'grab',
      }}
    >
      {label}
    </div>
  );
}

