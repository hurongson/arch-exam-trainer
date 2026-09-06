import { BaseBoxShapeUtil, TLBaseShape, T, HTMLContainer } from 'tldraw';

/** 柱类型 */
export type ColumnType = 'square' | 'circle' | 'rectangle';

/** 柱形状 */
export type ColumnShape = TLBaseShape<
  'arch-column',
  {
    w: number;
    h: number;
    columnType: ColumnType;
    color: string;
    filled: boolean;
  }
>;

/** 柱尺寸预设（mm，按1:100比例） */
export const COLUMN_SIZES = {
  small: { w: 24, h: 24 }, // 240x240
  medium: { w: 36, h: 36 }, // 360x360
  large: { w: 50, h: 50 }, // 500x500
};

/** 柱 ShapeUtil */
export class ColumnShapeUtil extends BaseBoxShapeUtil<any> {
  static type = 'arch-column' as const;

  static props = {
    w: T.number,
    h: T.number,
    columnType: T.string,
    color: T.string,
    filled: T.boolean,
  };

  getDefaultProps(): ColumnShape['props'] {
    return {
      w: 36,
      h: 36,
      columnType: 'square',
      color: '#1a1a1a',
      filled: true,
    };
  }

  component(shape: ColumnShape) {
    const { w, h, columnType, color, filled } = shape.props;

    return (
      <HTMLContainer
        style={{
          width: w,
          height: h,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <svg
          width={w}
          height={h}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          {columnType === 'square' && (
            <rect
              x={1}
              y={1}
              width={w - 2}
              height={h - 2}
              fill={filled ? color : 'none'}
              stroke={color}
              strokeWidth={1.5}
            />
          )}

          {columnType === 'circle' && (
            <circle
              cx={w / 2}
              cy={h / 2}
              r={Math.min(w, h) / 2 - 1}
              fill={filled ? color : 'none'}
              stroke={color}
              strokeWidth={1.5}
            />
          )}

          {columnType === 'rectangle' && (
            <rect
              x={1}
              y={1}
              width={w - 2}
              height={h - 2}
              fill={filled ? color : 'none'}
              stroke={color}
              strokeWidth={1.5}
            />
          )}

          {/* 柱中心十字线（建筑制图惯例） */}
          {filled && (
            <g stroke="#ffffff" strokeWidth={0.5} opacity={0.5}>
              <line x1={w / 2} y1={0} x2={w / 2} y2={h} />
              <line x1={0} y1={h / 2} x2={w} y2={h / 2} />
            </g>
          )}
        </svg>
      </HTMLContainer>
    );
  }

  getIndicatorPath(shape: ColumnShape) {
    const { w, h, columnType } = shape.props;
    const path = new Path2D();
    if (columnType === 'circle') {
      path.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
    } else {
      path.rect(0, 0, w, h);
    }
    return path;
  }

  canResize() {
    return true;
  }
}
