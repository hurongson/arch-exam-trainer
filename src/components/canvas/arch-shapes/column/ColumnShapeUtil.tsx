import { ShapeUtil, T, Rectangle2d, Geometry2d } from 'tldraw';

/** 柱类型 */
export type ColumnType = 'square' | 'circle';

/** 柱尺寸预设 */
export const COLUMN_SIZES = {
  small: { w: 24, h: 24 },
  medium: { w: 36, h: 36 },
  large: { w: 48, h: 48 },
};

/** 柱形状 - 简化稳定版 */
export class ColumnShapeUtil extends ShapeUtil<any> {
  static type = 'arch-column' as const;

  static props = {
    w: T.number,
    h: T.number,
    columnType: T.string,
    color: T.string,
    filled: T.boolean,
  };

  getDefaultProps() {
    return { w: 36, h: 36, columnType: 'square', color: '#1a1a1a', filled: true };
  }

  getGeometry(shape: any): Geometry2d {
    return new Rectangle2d({ x: 0, y: 0, width: shape.props.w, height: shape.props.h, isFilled: true });
  }

  component(shape: any) {
    const { w, h, columnType, color, filled } = shape.props;
    return (
      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}>
        {columnType === 'square' ? (
          <rect x={0} y={0} width={w} height={h} fill={filled ? color : '#ffffff'} stroke={color} strokeWidth={1.5} />
        ) : (
          <circle cx={w / 2} cy={h / 2} r={Math.min(w, h) / 2} fill={filled ? color : '#ffffff'} stroke={color} strokeWidth={1.5} />
        )}
        <line x1={-5} y1={h / 2} x2={w + 5} y2={h / 2} stroke={color} strokeWidth={0.5} strokeDasharray="3,2" />
        <line x1={w / 2} y1={-5} x2={w / 2} y2={h + 5} stroke={color} strokeWidth={0.5} strokeDasharray="3,2" />
      </svg>
    );
  }

  getIndicatorPath(shape: any) {
    const { w, h, columnType } = shape.props;
    const path = new Path2D();
    if (columnType === 'circle') {
      path.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
    } else {
      path.rect(0, 0, w, h);
    }
    return path;
  }

  canResize() { return true; }
  isAspectRatioLocked() { return true; }
}
