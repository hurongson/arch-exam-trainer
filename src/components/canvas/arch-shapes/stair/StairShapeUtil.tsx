import { ShapeUtil, T, Rectangle2d, Geometry2d } from 'tldraw';

/** 楼梯形状 - 简化稳定版 */
export class StairShapeUtil extends ShapeUtil<any> {
  static type = 'arch-stair' as const;

  static props = {
    w: T.number,
    h: T.number,
    stairType: T.string,
    stepCount: T.number,
    direction: T.string,
    color: T.string,
    showArrow: T.boolean,
  };

  getDefaultProps() {
    return { w: 120, h: 200, stairType: 'double-run', stepCount: 10, direction: 'up', color: '#1a1a1a', showArrow: true };
  }

  getGeometry(shape: any): Geometry2d {
    return new Rectangle2d({ x: 0, y: 0, width: shape.props.w, height: shape.props.h, isFilled: false });
  }

  component(shape: any) {
    const { w, h, stairType, stepCount, direction, color, showArrow } = shape.props;

    if (stairType === 'double-run') {
      // 双跑楼梯
      const steps = stepCount / 2;
      const stepH = (h - 20) / (steps * 2);
      const midY = h / 2;
      return (
        <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}>
          {/* 外轮廓 */}
          <rect x={0} y={0} width={w} height={h} fill="none" stroke={color} strokeWidth={1.5} />
          {/* 第一跑踏步 */}
          {Array.from({ length: steps }).map((_, i) => (
            <line key={`t1-${i}`} x1={0} y1={i * stepH + stepH} x2={w / 2} y2={i * stepH + stepH} stroke={color} strokeWidth={1} />
          ))}
          {/* 第二跑踏步 */}
          {Array.from({ length: steps }).map((_, i) => (
            <line key={`t2-${i}`} x1={w / 2} y1={h - i * stepH - stepH} x2={w} y2={h - i * stepH - stepH} stroke={color} strokeWidth={1} />
          ))}
          {/* 中间平台线 */}
          <line x1={0} y1={midY} x2={w} y2={midY} stroke={color} strokeWidth={1} strokeDasharray="4,2" />
          {/* 上行箭头 */}
          {showArrow && direction === 'up' && (
            <>
              <line x1={w / 4} y1={midY - 10} x2={w / 4} y2={20} stroke={color} strokeWidth={1.5} />
              <polygon points={`${w / 4},15 ${w / 4 - 5},25 ${w / 4 + 5},25`} fill={color} />
              <text x={w / 4 + 8} y={midY / 2} fontSize={10} fill={color} fontFamily="sans-serif">上</text>
            </>
          )}
        </svg>
      );
    }

    // 单跑楼梯
    const stepH = h / stepCount;
    return (
      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}>
        <rect x={0} y={0} width={w} height={h} fill="none" stroke={color} strokeWidth={1.5} />
        {Array.from({ length: stepCount }).map((_, i) => (
          <line key={i} x1={0} y1={i * stepH + stepH} x2={w} y2={i * stepH + stepH} stroke={color} strokeWidth={1} />
        ))}
        {showArrow && (
          <>
            <line x1={w / 2} y1={h - 10} x2={w / 2} y2={20} stroke={color} strokeWidth={1.5} />
            <polygon points={`${w / 2},15 ${w / 2 - 5},25 ${w / 2 + 5},25`} fill={color} />
          </>
        )}
      </svg>
    );
  }

  getIndicatorPath(shape: any) {
    const { w, h } = shape.props;
    const path = new Path2D();
    path.rect(0, 0, w, h);
    return path;
  }

  canResize() { return true; }
  isAspectRatioLocked() { return false; }
}
