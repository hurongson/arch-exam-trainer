import { ShapeUtil, TLBaseShape, T, Rectangle2d, Geometry2d, TLHandle, VecLike } from 'tldraw';

/** 墙类型 */
export type WallType = 'exterior' | 'interior' | 'partition';

/** 双线墙形状 */
export type WallShape = TLBaseShape<
  'arch-wall',
  {
    start: VecLike;
    end: VecLike;
    thickness: number; // 墙厚（像素，按1:100比例，240墙=24px）
    wallType: WallType;
    color: string;
  }
>;

/** 墙厚预设（mm，按1:100比例转换为像素） */
export const WALL_THICKNESS = {
  exterior: 24, // 240mm 外墙
  interior: 12, // 120mm 内墙
  partition: 6, // 60mm 隔墙
};

/** 双线墙 ShapeUtil */
export class WallShapeUtil extends ShapeUtil<any> {
  static type = 'arch-wall' as const;

  static props = {
    start: T.object({ x: T.number, y: T.number }),
    end: T.object({ x: T.number, y: T.number }),
    thickness: T.number,
    wallType: T.string,
    color: T.string,
  };

  getDefaultProps(): WallShape['props'] {
    return {
      start: { x: 0, y: 0 },
      end: { x: 200, y: 0 },
      thickness: WALL_THICKNESS.exterior,
      wallType: 'exterior',
      color: '#1a1a1a',
    };
  }

  getGeometry(shape: WallShape): Geometry2d {
    // 用矩形近似墙的几何（用于选择和碰撞）
    const { start, end, thickness } = shape.props;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const cx = (start.x + end.x) / 2;
    const cy = (start.y + end.y) / 2;
    return new Rectangle2d({
      x: cx - length / 2,
      y: cy - thickness / 2,
      width: length,
      height: thickness,
      isFilled: true,
      
    });
  }

  component(shape: WallShape) {
    const { start, end, thickness, color } = shape.props;
    const halfThickness = thickness / 2;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy) || 1;
    // 法线方向
    const nx = -dy / length;
    const ny = dx / length;

    // 两条平行线的端点
    const p1 = { x: start.x + nx * halfThickness, y: start.y + ny * halfThickness };
    const p2 = { x: end.x + nx * halfThickness, y: end.y + ny * halfThickness };
    const p3 = { x: end.x - nx * halfThickness, y: end.y - ny * halfThickness };
    const p4 = { x: start.x - nx * halfThickness, y: start.y - ny * halfThickness };

    return (
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
      >
        {/* 墙填充（白色） */}
        <polygon
          points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
          fill="#ffffff"
          stroke="none"
        />
        {/* 两条墙线 */}
        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth={1.5} />
        <line x1={p4.x} y1={p4.y} x2={p3.x} y2={p3.y} stroke={color} strokeWidth={1.5} />
        {/* 端部封口 */}
        <line x1={p1.x} y1={p1.y} x2={p4.x} y2={p4.y} stroke={color} strokeWidth={1.5} />
        <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke={color} strokeWidth={1.5} />
      </svg>
    );
  }

  getIndicatorPath(shape: WallShape) {
    const { start, end, thickness } = shape.props;
    const halfThickness = thickness / 2;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / length;
    const ny = dx / length;
    const path = new Path2D();
    path.moveTo(start.x + nx * halfThickness, start.y + ny * halfThickness);
    path.lineTo(end.x + nx * halfThickness, end.y + ny * halfThickness);
    path.lineTo(end.x - nx * halfThickness, end.y - ny * halfThickness);
    path.lineTo(start.x - nx * halfThickness, start.y - ny * halfThickness);
    path.closePath();
    return path;
  }

  getHandles(shape: WallShape): TLHandle[] {
    return [
      { id: 'start', type: 'vertex', index: 0 as any, x: shape.props.start.x, y: shape.props.start.y },
      { id: 'end', type: 'vertex', index: 1 as any, x: shape.props.end.x, y: shape.props.end.y },
    ];
  }

  onHandleDrag(shape: WallShape, info: any): any {
    if (info.handle.id === 'start') {
      return { props: { start: { x: info.handle.x, y: info.handle.y } } };
    }
    if (info.handle.id === 'end') {
      return { props: { end: { x: info.handle.x, y: info.handle.y } } };
    }
    return;
  }

  canResize() {
    return false;
  }

  isAspectRatioLocked() {
    return true;
  }
}
