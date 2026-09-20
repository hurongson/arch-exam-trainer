import { ShapeUtil, TLBaseShape, T, Rectangle2d, Geometry2d, VecLike } from 'tldraw';

/** 墙类型 */
export type WallType = 'exterior' | 'interior' | 'partition';

/** 双线墙形状 */
export type WallShape = TLBaseShape<
  'arch-wall',
  {
    w: number;
    h: number;
    thickness: number;
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

/** 双线墙 ShapeUtil - 简化版，确保tldraw 5.x兼容 */
export class WallShapeUtil extends ShapeUtil<any> {
  static type = 'arch-wall' as const;

  static props = {
    w: T.number,
    h: T.number,
    thickness: T.number,
    wallType: T.string,
    color: T.string,
  };

  getDefaultProps(): WallShape['props'] {
    return {
      w: 200,
      h: WALL_THICKNESS.exterior,
      thickness: WALL_THICKNESS.exterior,
      wallType: 'exterior',
      color: '#1a1a1a',
    };
  }

  getGeometry(shape: WallShape): Geometry2d {
    return new Rectangle2d({
      x: 0,
      y: 0,
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape: WallShape) {
    const { w, h, color } = shape.props;

    return (
      <svg
        width={w}
        height={h}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
      >
        {/* 墙填充（白色） */}
        <rect x={0} y={0} width={w} height={h} fill="#ffffff" stroke="none" />
        {/* 两条墙线 */}
        <line x1={0} y1={0.5} x2={w} y2={0.5} stroke={color} strokeWidth={1.5} />
        <line x1={0} y1={h - 0.5} x2={w} y2={h - 0.5} stroke={color} strokeWidth={1.5} />
        {/* 端部封口 */}
        <line x1={0} y1={0} x2={0} y2={h} stroke={color} strokeWidth={1.5} />
        <line x1={w} y1={0} x2={w} y2={h} stroke={color} strokeWidth={1.5} />
      </svg>
    );
  }

  getIndicatorPath(shape: WallShape) {
    const { w, h } = shape.props;
    const path = new Path2D();
    path.rect(0, 0, w, h);
    return path;
  }

  canResize() {
    return true;
  }

  isAspectRatioLocked() {
    return false;
  }
}
