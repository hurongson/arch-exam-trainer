import { BaseBoxShapeUtil, TLBaseShape, T, HTMLContainer } from 'tldraw';

/** 窗形状 */
export type WindowShape = TLBaseShape<
  'arch-window',
  {
    w: number;
    h: number;
    windowType: 'fixed' | 'sliding' | 'casement';
    color: string;
    wallThickness: number;
  }
>;

/** 窗 ShapeUtil - 四线表示法 */
export class WindowShapeUtil extends BaseBoxShapeUtil<any> {
  static type = 'arch-window' as const;

  static props = {
    w: T.number,
    h: T.number,
    windowType: T.string,
    color: T.string,
    wallThickness: T.number,
  };

  getDefaultProps(): WindowShape['props'] {
    return {
      w: 150, // 1500mm 窗宽
      h: 12,
      windowType: 'fixed',
      color: '#1a1a1a',
      wallThickness: 24,
    };
  }

  component(shape: WindowShape) {
    const { w, windowType, color, wallThickness } = shape.props;
    const halfWall = wallThickness / 2;

    return (
      <HTMLContainer
        style={{
          width: w,
          height: wallThickness,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <svg
          width={w}
          height={wallThickness}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
        >
          {/* 四线窗：墙线中间两条细线 */}
          {/* 外墙线 */}
          <line x1={0} y1={0} x2={w} y2={0} stroke={color} strokeWidth={1.5} />
          <line x1={0} y1={wallThickness} x2={w} y2={wallThickness} stroke={color} strokeWidth={1.5} />
          {/* 中间两条窗线 */}
          <line x1={0} y1={halfWall - 2} x2={w} y2={halfWall - 2} stroke={color} strokeWidth={1} />
          <line x1={0} y1={halfWall + 2} x2={w} y2={halfWall + 2} stroke={color} strokeWidth={1} />

          {/* 窗类型标记 */}
          {windowType === 'sliding' && (
            <>
              {/* 推拉窗分隔线 */}
              <line x1={w / 2} y1={0} x2={w / 2} y2={wallThickness} stroke={color} strokeWidth={1} />
              {/* 开启方向箭头 */}
              <line x1={w / 4} y1={halfWall} x2={w * 0.75} y2={halfWall} stroke={color} strokeWidth={0.5} strokeDasharray="2,2" />
            </>
          )}

          {windowType === 'casement' && (
            <>
              {/* 平开窗：小弧线表示开启方向 */}
              <path
                d={`M 0 ${halfWall} A ${w / 3} ${w / 3} 0 0 1 ${w / 3} ${halfWall - w / 6}`}
                fill="none"
                stroke={color}
                strokeWidth={0.5}
              />
              <line x1={w / 2} y1={0} x2={w / 2} y2={wallThickness} stroke={color} strokeWidth={1} />
            </>
          )}
        </svg>
      </HTMLContainer>
    );
  }

  getIndicatorPath(shape: WindowShape) {
    const { w, wallThickness } = shape.props;
    const path = new Path2D();
    path.rect(0, 0, w, wallThickness);
    return path;
  }

  canResize() {
    return true;
  }
}
