'use client';

import React, { useContext, useMemo } from 'react';
import { HolderOutlined, DeleteOutlined } from '@ant-design/icons';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Table, Popconfirm, Image } from 'antd';
import type { TableColumnsType } from 'antd';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { useAppSelector, useAppDispatch } from '@/lib/hooks'; // <-- your store hooks
import {
  deleteElement,
  reorderElements,
} from '@/lib/slideElementSlice';

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}
const RowContext = React.createContext<RowContextProps>({});

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: 'move' }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

const SlideElementTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const elements = useAppSelector((state) => state.sliceElements);

  const dataSource = useMemo(
    () =>
      elements.map((e) => ({
        ...e,
        key: e.id,
      })),
    [elements]
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const oldIndex = elements.findIndex((item) => item.id === active.id);
      const newIndex = elements.findIndex((item) => item.id === over?.id);
      dispatch(reorderElements({ oldIndex, newIndex }));
    }
  };

  const handleDelete = (id: string) => {
    dispatch(deleteElement(id));
  };

  const columns: TableColumnsType<SlideElement & { key: string }> = [
    { key: 'sort', align: 'center', width: 50, render: () => <DragHandle /> },
    { title: 'Type', dataIndex: 'type' },
    {
      title: 'Content',
      dataIndex: 'content',
      width: 70,
      render: (value, record) =>
        record.type === 'image' ? (
          <Image src={value} height={30} />
        ) : (
          `${value.slice(0, 5)}`
        ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Delete this item?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext
        items={elements.map((e) => e.id)}
        strategy={verticalListSortingStrategy}
      >
        <Table<SlideElement & { key: string }>
          rowKey="id"
          components={{ body: { row: Row } }}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
        />
      </SortableContext>
    </DndContext>
  );
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}
const Row: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props['data-row-key'] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

export default SlideElementTable;

