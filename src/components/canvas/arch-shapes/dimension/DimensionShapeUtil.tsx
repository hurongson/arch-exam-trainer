import { ShapeUtil, T, Rectangle2d, Geometry2d } from 'tldraw';

/** 尺寸标注形状 - 简化稳定版 */
export class DimensionShapeUtil extends ShapeUtil<any> {
  static type = 'arch-dimension' as const;

  static props = {
    w: T.number,
    h: T.number,
    text: T.string,
    color: T.string,
    fontSize: T.number,
  };

  getDefaultProps() {
    return { w: 200, h: 40, text: '3600', color: '#1a1a1a', fontSize: 12 };
  }

  getGeometry(shape: any): Geometry2d {
    return new Rectangle2d({ x: 0, y: 0, width: shape.props.w, height: shape.props.h, isFilled: false });
  }

  component(shape: any) {
    const { w, h, text, color, fontSize } = shape.props;
    const dimY = h - 10;
    return (
      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}>
        {/* 尺寸线 */}
        <line x1={10} y1={dimY} x2={w - 10} y2={dimY} stroke={color} strokeWidth={1} />
        {/* 尺寸界线 */}
        <line x1={10} y1={dimY - 8} x2={10} y2={dimY + 4} stroke={color} strokeWidth={1} />
        <line x1={w - 10} y1={dimY - 8} x2={w - 10} y2={dimY + 4} stroke={color} strokeWidth={1} />
        {/* 箭头 */}
        <polygon points={`10,${dimY} 16,${dimY - 3} 16,${dimY + 3}`} fill={color} />
        <polygon points={`${w - 10},${dimY} ${w - 16},${dimY - 3} ${w - 16},${dimY + 3}`} fill={color} />
        {/* 尺寸文字 */}
        <text x={w / 2} y={dimY - 6} textAnchor="middle" fontSize={fontSize} fill={color} fontFamily="sans-serif">
          {text}
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
