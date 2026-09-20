import { ShapeUtil, T, Rectangle2d, Geometry2d } from 'tldraw';

/** 门类型 */
export type DoorType = 'swing' | 'sliding' | 'double';

/** 门形状 - 简化稳定版 */
export class DoorShapeUtil extends ShapeUtil<any> {
  static type = 'arch-door' as const;

  static props = {
    w: T.number,
    h: T.number,
    doorType: T.string,
    swingDirection: T.string,
    color: T.string,
    wallThickness: T.number,
  };

  getDefaultProps() {
    return {
      w: 90,
      h: 12,
      doorType: 'swing',
      swingDirection: 'right',
      color: '#1a1a1a',
      wallThickness: 24,
    };
  }

  getGeometry(shape: any): Geometry2d {
    const wallT = shape.props.wallThickness || 24;
    return new Rectangle2d({
      x: 0,
      y: 0,
      width: shape.props.w + wallT,
      height: shape.props.w + wallT,
      isFilled: false,
    });
  }

  component(shape: any) {
    const { w, doorType, color } = shape.props;
    const wallT = shape.props.wallThickness || 24;
    const cx = wallT / 2;
    const cy = wallT / 2;

    return (
      <svg
        width={w + wallT * 2}
        height={w + wallT}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
      >
        {/* 墙线 */}
        <line x1={0} y1={cy + 0.5} x2={cx} y2={cy + 0.5} stroke={color} strokeWidth={1.5} />
        <line x1={cx + w} y1={cy + 0.5} x2={w + wallT * 2} y2={cy + 0.5} stroke={color} strokeWidth={1.5} />
        <line x1={0} y1={cy + wallT - 0.5} x2={cx} y2={cy + wallT - 0.5} stroke={color} strokeWidth={1.5} />
        <line x1={cx + w} y1={cy + wallT - 0.5} x2={w + wallT * 2} y2={cy + wallT - 0.5} stroke={color} strokeWidth={1.5} />

        {doorType === 'swing' && (
          <>
            <line x1={cx} y1={cy + wallT / 2} x2={cx + w} y2={cy + wallT / 2} stroke={color} strokeWidth={2} />
            <path d={`M ${cx + w} ${cy + wallT / 2} A ${w} ${w} 0 0 0 ${cx} ${cy + wallT / 2 - w}`} fill="none" stroke={color} strokeWidth={1} strokeDasharray="4,2" />
            <circle cx={cx} cy={cy + wallT / 2} r={2} fill={color} />
          </>
        )}
        {doorType === 'sliding' && (
          <>
            <line x1={cx} y1={cy + wallT / 2} x2={cx + w / 2} y2={cy + wallT / 2} stroke={color} strokeWidth={2} />
            <line x1={cx + w / 2} y1={cy + wallT / 2 - 3} x2={cx + w} y2={cy + wallT / 2 - 3} stroke={color} strokeWidth={2} />
          </>
        )}
        {doorType === 'double' && (
          <>
            <line x1={cx} y1={cy + wallT / 2} x2={cx + w / 2} y2={cy + wallT / 2} stroke={color} strokeWidth={2} />
            <line x1={cx + w / 2} y1={cy + wallT / 2} x2={cx + w} y2={cy + wallT / 2} stroke={color} strokeWidth={2} />
            <path d={`M ${cx + w / 2} ${cy + wallT / 2} A ${w / 2} ${w / 2} 0 0 0 ${cx} ${cy + wallT / 2 - w / 2}`} fill="none" stroke={color} strokeWidth={1} strokeDasharray="4,2" />
            <path d={`M ${cx + w / 2} ${cy + wallT / 2} A ${w / 2} ${w / 2} 0 0 1 ${cx + w} ${cy + wallT / 2 - w / 2}`} fill="none" stroke={color} strokeWidth={1} strokeDasharray="4,2" />
          </>
        )}
      </svg>
    );
  }

  getIndicatorPath(shape: any) {
    const { w } = shape.props;
    const wallT = shape.props.wallThickness || 24;
    const path = new Path2D();
    path.rect(0, 0, w + wallT * 2, w + wallT);
    return path;
  }

  canResize() { return true; }
  isAspectRatioLocked() { return false; }
}
