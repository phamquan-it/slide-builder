import React from 'react';
import { Card, Tooltip } from 'antd';

export interface Subject {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface SubjectListProps {
  onSelect?: (subject: Subject) => void;
}

// 🎨 Colorful SVG Icons
const fixedSubjects: Subject[] = [
  {
    id: 'math',
    name: 'Toán học',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" fill="#4F46E5" />
        <text x="12" y="17" textAnchor="middle" fontSize="12" fill="#fff">π</text>
      </svg>
    ),
  },
  {
    id: 'phys',
    name: 'Vật lý',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" />
        <line x1="12" y1="2" x2="12" y2="22" stroke="#10B981" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'geo',
    name: 'Địa lý',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2a10 10 0 100 20 10 10 0 000-20z"
          fill="#F59E0B"
        />
        <path
          d="M12 2c2 2 2 8 0 10s-2 8 0 10"
          stroke="#fff"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    id: 'eng',
    name: 'Tiếng Anh',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" fill="#3B82F6" rx="2" />
        <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff">EN</text>
      </svg>
    ),
  },
  {
    id: 'custom',
    name: 'SVG Icon',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 4v16m8-8H4" stroke="#EF4444" strokeWidth="2" />
      </svg>
    ),
  },
];

const SubjectList: React.FC<SubjectListProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {fixedSubjects.map((subject) => (
        <Tooltip key={subject.id} title={subject.name}>
          <Card
            hoverable
            onClick={() => onSelect?.(subject)}
            className="cursor-pointer transition-all text-center"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="text-2xl">{subject.icon}</div>
              <div className="font-medium">{subject.name}</div>
            </div>
          </Card>
        </Tooltip>
      ))}
    </div>
  );
};

export default SubjectList;

