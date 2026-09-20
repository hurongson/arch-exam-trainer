import { ShapeUtil, T, Rectangle2d, Geometry2d } from 'tldraw';

/** 标高形状 - 简化稳定版 */
export class ElevationShapeUtil extends ShapeUtil<any> {
  static type = 'arch-elevation' as const;

  static props = {
    w: T.number,
    h: T.number,
    elevation: T.string,
    direction: T.string,
    color: T.string,
  };

  getDefaultProps() {
    return { w: 80, h: 24, elevation: '±0.000', direction: 'down', color: '#1a1a1a' };
  }

  getGeometry(shape: any): Geometry2d {
    return new Rectangle2d({ x: 0, y: 0, width: shape.props.w, height: shape.props.h, isFilled: false });
  }

  component(shape: any) {
    const { w, h, elevation, direction, color } = shape.props;
    const triangleSize = 8;
    const textY = direction === 'down' ? h - 6 : 12;
    return (
      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}>
        {/* 标高三角形 */}
        {direction === 'down' ? (
          <polygon points={`0,${h - triangleSize} ${triangleSize},${h} ${triangleSize * 2},${h - triangleSize}`} fill="#ffffff" stroke={color} strokeWidth={1} />
        ) : (
          <polygon points={`0,${triangleSize} ${triangleSize},0 ${triangleSize * 2},${triangleSize}`} fill="#ffffff" stroke={color} strokeWidth={1} />
        )}
        {/* 水平线 */}
        <line x1={triangleSize * 2} y1={direction === 'down' ? h - triangleSize : triangleSize} x2={w} y2={direction === 'down' ? h - triangleSize : triangleSize} stroke={color} strokeWidth={1} />
        {/* 标高文字 */}
        <text x={triangleSize * 2 + 4} y={textY} fontSize={11} fill={color} fontFamily="sans-serif">
          {elevation}
        </text>
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
