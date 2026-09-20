import { ShapeUtil, T, Rectangle2d, Geometry2d } from 'tldraw';

/** 窗形状 - 简化稳定版 */
export class WindowShapeUtil extends ShapeUtil<any> {
  static type = 'arch-window' as const;

  static props = {
    w: T.number,
    h: T.number,
    windowType: T.string,
    color: T.string,
    wallThickness: T.number,
  };

  getDefaultProps() {
    return { w: 150, h: 12, windowType: 'fixed', color: '#1a1a1a', wallThickness: 24 };
  }

  getGeometry(shape: any): Geometry2d {
    const wallT = shape.props.wallThickness || 24;
    return new Rectangle2d({ x: 0, y: 0, width: shape.props.w, height: wallT, isFilled: false });
  }

  component(shape: any) {
    const { w, color } = shape.props;
    const wallT = shape.props.wallThickness || 24;
    return (
      <svg width={w} height={wallT} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}>
        <rect x={0} y={0} width={w} height={wallT} fill="#ffffff" stroke="none" />
        <line x1={0} y1={0.5} x2={w} y2={0.5} stroke={color} strokeWidth={1.5} />
        <line x1={0} y1={wallT - 0.5} x2={w} y2={wallT - 0.5} stroke={color} strokeWidth={1.5} />
        <line x1={0} y1={wallT * 0.3} x2={w} y2={wallT * 0.3} stroke={color} strokeWidth={1} />
        <line x1={0} y1={wallT * 0.7} x2={w} y2={wallT * 0.7} stroke={color} strokeWidth={1} />
        <line x1={w / 2} y1={0} x2={w / 2} y2={wallT} stroke={color} strokeWidth={1} />
      </svg>
    );
  }

  getIndicatorPath(shape: any) {
    const { w } = shape.props;
    const wallT = shape.props.wallThickness || 24;
    const path = new Path2D();
    path.rect(0, 0, w, wallT);
    return path;
  }

  canResize() { return true; }
  isAspectRatioLocked() { return false; }
}
