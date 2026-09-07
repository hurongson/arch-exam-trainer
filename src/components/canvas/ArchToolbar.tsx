'use client';

import { useState, memo } from 'react';
import {
  Square,
  Minus,
  DoorOpen,
  Columns3,
  Ruler,
  CircleDot,
  Triangle,
  TrendingUp,
  Frame,
  ChevronDown,
  ChevronUp,
  Pencil,
  Type,
  Eraser,
} from 'lucide-react';

interface ArchToolbarProps {
  onCreateWall: (type: 'exterior' | 'interior' | 'partition') => void;
  onCreateDoor: (type: 'swing' | 'sliding' | 'double') => void;
  onCreateWindow: () => void;
  onCreateColumn: (size: 'small' | 'medium' | 'large') => void;
  onCreateDimension: () => void;
  onCreateAxisLabel: (label: string) => void;
  onCreateElevation: (elevation: string) => void;
  onCreateStair: () => void;
  onInsertTitleBlock: (size: 'A1' | 'A2' | 'A3' | 'A4') => void;
}

/** 工具栏分组 */
const toolGroups = [
  {
    id: 'wall',
    label: '墙体',
    icon: Minus,
    items: [
      { id: 'exterior', label: '外墙240', action: 'wall' as const, value: 'exterior' as const },
      { id: 'interior', label: '内墙120', action: 'wall' as const, value: 'interior' as const },
      { id: 'partition', label: '隔墙60', action: 'wall' as const, value: 'partition' as const },
    ],
  },
  {
    id: 'door',
    label: '门窗',
    icon: DoorOpen,
    items: [
      { id: 'swing', label: '平开门', action: 'door' as const, value: 'swing' as const },
      { id: 'sliding', label: '推拉门', action: 'door' as const, value: 'sliding' as const },
      { id: 'double', label: '双开门', action: 'door' as const, value: 'double' as const },
      { id: 'window', label: '窗', action: 'window' as const, value: undefined },
    ],
  },
  {
    id: 'column',
    label: '柱网',
    icon: Columns3,
    items: [
      { id: 'col-small', label: '柱240', action: 'column' as const, value: 'small' as const },
      { id: 'col-medium', label: '柱360', action: 'column' as const, value: 'medium' as const },
      { id: 'col-large', label: '柱500', action: 'column' as const, value: 'large' as const },
    ],
  },
  {
    id: 'dimension',
    label: '标注',
    icon: Ruler,
    items: [
      { id: 'dim', label: '尺寸标注', action: 'dimension' as const, value: undefined },
      { id: 'axis-A', label: '轴号A', action: 'axis' as const, value: 'A' },
      { id: 'axis-1', label: '轴号1', action: 'axis' as const, value: '1' },
      { id: 'elev-0', label: '标高±0.000', action: 'elevation' as const, value: '±0.000' },
      { id: 'elev-36', label: '标高3.600', action: 'elevation' as const, value: '3.600' },
    ],
  },
  {
    id: 'stair',
    label: '楼梯',
    icon: TrendingUp,
    items: [
      { id: 'stair-double', label: '双跑楼梯', action: 'stair' as const, value: undefined },
    ],
  },
  {
    id: 'frame',
    label: '图框',
    icon: Frame,
    items: [
      { id: 'A2', label: 'A2图框', action: 'frame' as const, value: 'A2' as const },
      { id: 'A3', label: 'A3图框', action: 'frame' as const, value: 'A3' as const },
      { id: 'A1', label: 'A1图框', action: 'frame' as const, value: 'A1' as const },
    ],
  },
];

export const ArchToolbar = memo(function ArchToolbar({
  onCreateWall,
  onCreateDoor,
  onCreateWindow,
  onCreateColumn,
  onCreateDimension,
  onCreateAxisLabel,
  onCreateElevation,
  onCreateStair,
  onInsertTitleBlock,
}: ArchToolbarProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>('wall');

  const handleItemClick = (group: typeof toolGroups[0], item: typeof toolGroups[0]['items'][0]) => {
    switch (item.action) {
      case 'wall':
        onCreateWall(item.value as 'exterior' | 'interior' | 'partition');
        break;
      case 'door':
        onCreateDoor(item.value as 'swing' | 'sliding' | 'double');
        break;
      case 'window':
        onCreateWindow();
        break;
      case 'column':
        onCreateColumn(item.value as 'small' | 'medium' | 'large');
        break;
      case 'dimension':
        onCreateDimension();
        break;
      case 'axis':
        onCreateAxisLabel(item.value as string);
        break;
      case 'elevation':
        onCreateElevation(item.value as string);
        break;
      case 'stair':
        onCreateStair();
        break;
      case 'frame':
        onInsertTitleBlock(item.value as 'A1' | 'A2' | 'A3' | 'A4');
        break;
    }
  };

  return (
    <div className="absolute left-2 top-2 z-50 flex flex-col gap-1 rounded-xl border border-gray-200 bg-white/95 p-2 shadow-lg backdrop-blur-sm" style={{ width: 140 }}>
      <div className="mb-1 border-b border-gray-100 pb-1.5 text-center">
        <span className="text-[11px] font-semibold text-gray-700">建筑工具</span>
      </div>

      {toolGroups.map((group) => {
        const Icon = group.icon;
        const isExpanded = expandedGroup === group.id;

        return (
          <div key={group.id} className="overflow-hidden">
            <button
              onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              <span className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                {group.label}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-3 w-3 text-gray-400" />
              ) : (
                <ChevronDown className="h-3 w-3 text-gray-400" />
              )}
            </button>

            {isExpanded && (
              <div className="mt-1 flex flex-col gap-0.5 pl-2">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(group, item)}
                    className="w-full rounded-md px-2 py-1 text-left text-[11px] text-gray-600 transition-colors hover:bg-gray-100"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* 分隔线 */}
      <div className="my-1 border-t border-gray-100" />

      {/* 提示 */}
      <div className="px-1 text-[10px] leading-relaxed text-gray-400">
        点击工具插入形状，拖动调整位置和大小
      </div>
    </div>
  );
});
