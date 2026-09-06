/**
 * 建筑专业自定义形状索引
 * 导出所有建筑绘图相关的 ShapeUtil
 */

import { WallShapeUtil } from './wall/WallShapeUtil';
import { DoorShapeUtil } from './door/DoorShapeUtil';
import { WindowShapeUtil } from './window/WindowShapeUtil';
import { ColumnShapeUtil } from './column/ColumnShapeUtil';
import { DimensionShapeUtil } from './dimension/DimensionShapeUtil';
import { AxisLabelShapeUtil } from './axis/AxisLabelShapeUtil';
import { ElevationShapeUtil } from './elevation/ElevationShapeUtil';
import { StairShapeUtil } from './stair/StairShapeUtil';
import { TitleBlockShapeUtil } from './titleblock/TitleBlockShapeUtil';

/** 所有建筑自定义形状工具 */
export const archShapeUtils = [
  WallShapeUtil,
  DoorShapeUtil,
  WindowShapeUtil,
  ColumnShapeUtil,
  DimensionShapeUtil,
  AxisLabelShapeUtil,
  ElevationShapeUtil,
  StairShapeUtil,
  TitleBlockShapeUtil,
];

/** 形状类型枚举 */
export const ArchShapeTypes = {
  WALL: 'arch-wall',
  DOOR: 'arch-door',
  WINDOW: 'arch-window',
  COLUMN: 'arch-column',
  DIMENSION: 'arch-dimension',
  AXIS_LABEL: 'arch-axis-label',
  ELEVATION: 'arch-elevation',
  STAIR: 'arch-stair',
  TITLE_BLOCK: 'arch-titleblock',
} as const;

export type ArchShapeType = (typeof ArchShapeTypes)[keyof typeof ArchShapeTypes];

export {
  WallShapeUtil,
  DoorShapeUtil,
  WindowShapeUtil,
  ColumnShapeUtil,
  DimensionShapeUtil,
  AxisLabelShapeUtil,
  ElevationShapeUtil,
  StairShapeUtil,
  TitleBlockShapeUtil,
};

export { WALL_THICKNESS, type WallType, type WallShape } from './wall/WallShapeUtil';
export { COLUMN_SIZES, type ColumnType, type ColumnShape } from './column/ColumnShapeUtil';
export { SHEET_DIMENSIONS, type SheetSize, type TitleBlockShape } from './titleblock/TitleBlockShapeUtil';
