import { ShapeUtil, T, Rectangle2d, Geometry2d } from 'tldraw';

/** 轴号形状 - 简化稳定版 */
export class AxisLabelShapeUtil extends ShapeUtil<any> {
  static type = 'arch-axis-label' as const;

  static props = {
    w: T.number,
    h: T.number,
    label: T.string,
    hasLeader: T.boolean,
    leaderDirection: T.string,
    color: T.string,
  };

  getDefaultProps() {
    return { w: 28, h: 28, label: 'A', hasLeader: true, leaderDirection: 'bottom', color: '#1a1a1a' };
  }

  getGeometry(shape: any): Geometry2d {
    const extra = shape.props.hasLeader ? 20 : 0;
    return new Rectangle2d({ x: 0, y: 0, width: shape.props.w, height: shape.props.h + extra, isFilled: false });
  }

  component(shape: any) {
    const { w, h, label, hasLeader, leaderDirection, color } = shape.props;
    const cx = w / 2;
    const cy = h / 2;
    return (
      <svg width={w} height={h + (hasLeader ? 20 : 0)} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}>
        {/* 轴号圆圈 */}
        <circle cx={cx} cy={cy} r={w / 2 - 1} fill="#ffffff" stroke={color} strokeWidth={1.5} />
        {/* 轴号文字 */}
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={12} fontWeight="bold" fill={color} fontFamily="sans-serif">
          {label}
        </text>
        {/* 引出线 */}
        {hasLeader && leaderDirection === 'bottom' && (
          <line x1={cx} y1={h} x2={cx} y2={h + 20} stroke={color} strokeWidth={1} />
        )}
        {hasLeader && leaderDirection === 'top' && (
          <line x1={cx} y1={0} x2={cx} y2={-20} stroke={color} strokeWidth={1} />
        )}
        {hasLeader && leaderDirection === 'left' && (
          <line x1={0} y1={cy} x2={-20} y2={cy} stroke={color} strokeWidth={1} />
        )}
        {hasLeader && leaderDirection === 'right' && (
          <line x1={w} y1={cy} x2={w + 20} y2={cy} stroke={color} strokeWidth={1} />
        )}
      </svg>
    );
  }

  getIndicatorPath(shape: any) {
    const { w, h } = shape.props;
    const path = new Path2D();
    path.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
    return path;
  }

  canResize() { return true; }
  isAspectRatioLocked() { return true; }
}
