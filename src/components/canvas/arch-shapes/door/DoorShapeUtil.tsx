import { BaseBoxShapeUtil, TLBaseShape, T, HTMLContainer } from 'tldraw';

/** 门类型 */
export type DoorType = 'swing' | 'sliding' | 'double';

/** 门形状 */
export type DoorShape = TLBaseShape<
  'arch-door',
  {
    w: number;
    h: number;
    doorType: DoorType;
    swingDirection: 'left' | 'right'; // 平开门开启方向
    color: string;
    wallThickness: number; // 所在墙厚
  }
>;

/** 门 ShapeUtil */
export class DoorShapeUtil extends BaseBoxShapeUtil<any> {
  static type = 'arch-door' as const;

  static props = {
    w: T.number,
    h: T.number,
    doorType: T.string,
    swingDirection: T.string,
    color: T.string,
    wallThickness: T.number,
  };

  getDefaultProps(): DoorShape['props'] {
    return {
      w: 90, // 900mm 门宽
      h: 12, // 墙厚方向
      doorType: 'swing',
      swingDirection: 'right',
      color: '#1a1a1a',
      wallThickness: 24,
    };
  }

  component(shape: DoorShape) {
    const { w, h, doorType, swingDirection, color, wallThickness } = shape.props;
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
          width={w + 20}
          height={wallThickness + w + 20}
          style={{
            position: 'absolute',
            top: -w / 2 - 10,
            left: -10,
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          {doorType === 'swing' && (
            <g>
              {/* 门板 */}
              {swingDirection === 'right' ? (
                <>
                  <line x1={10} y1={10 + w / 2} x2={10} y2={10 + w / 2 - halfWall} stroke={color} strokeWidth={2} />
                  {/* 90度弧线 */}
                  <path
                    d={`M 10 ${10 + w / 2 - halfWall} A ${w} ${w} 0 0 1 ${10 + w} ${10 + w / 2 - halfWall}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={1}
                    strokeDasharray="4,2"
                  />
                  {/* 门板线 */}
                  <line x1={10} y1={10 + w / 2 - halfWall} x2={10 + w} y2={10 + w / 2 - halfWall} stroke={color} strokeWidth={2} />
                </>
              ) : (
                <>
                  <line x1={10 + w} y1={10 + w / 2} x2={10 + w} y2={10 + w / 2 - halfWall} stroke={color} strokeWidth={2} />
                  <path
                    d={`M ${10 + w} ${10 + w / 2 - halfWall} A ${w} ${w} 0 0 0 ${10} ${10 + w / 2 - halfWall}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={1}
                    strokeDasharray="4,2"
                  />
                  <line x1={10 + w} y1={10 + w / 2 - halfWall} x2={10} y2={10 + w / 2 - halfWall} stroke={color} strokeWidth={2} />
                </>
              )}
            </g>
          )}

          {doorType === 'sliding' && (
            <g>
              {/* 推拉门：两条错开的线 */}
              <line x1={10} y1={10 + w / 2 - halfWall / 2} x2={10 + w / 2 + 10} y2={10 + w / 2 - halfWall / 2} stroke={color} strokeWidth={2} />
              <line x1={10 + w / 2} y1={10 + w / 2 + halfWall / 2} x2={10 + w + 10} y2={10 + w / 2 + halfWall / 2} stroke={color} strokeWidth={2} />
              {/* 轨道 */}
              <line x1={10} y1={10 + w / 2} x2={10 + w + 10} y2={10 + w / 2} stroke={color} strokeWidth={0.5} />
            </g>
          )}

          {doorType === 'double' && (
            <g>
              {/* 双开门 */}
              <line x1={10 + w / 2} y1={10 + w / 2} x2={10 + w / 2} y2={10 + w / 2 - halfWall} stroke={color} strokeWidth={2} />
              <path
                d={`M ${10 + w / 2} ${10 + w / 2 - halfWall} A ${w / 2} ${w / 2} 0 0 1 ${10} ${10 + w / 2 - halfWall}`}
                fill="none"
                stroke={color}
                strokeWidth={1}
                strokeDasharray="4,2"
              />
              <path
                d={`M ${10 + w / 2} ${10 + w / 2 - halfWall} A ${w / 2} ${w / 2} 0 0 0 ${10 + w} ${10 + w / 2 - halfWall}`}
                fill="none"
                stroke={color}
                strokeWidth={1}
                strokeDasharray="4,2"
              />
              <line x1={10 + w / 2} y1={10 + w / 2 - halfWall} x2={10} y2={10 + w / 2 - halfWall} stroke={color} strokeWidth={2} />
              <line x1={10 + w / 2} y1={10 + w / 2 - halfWall} x2={10 + w} y2={10 + w / 2 - halfWall} stroke={color} strokeWidth={2} />
            </g>
          )}
        </svg>
      </HTMLContainer>
    );
  }

  getIndicatorPath(shape: DoorShape) {
    const { w, wallThickness } = shape.props;
    const path = new Path2D();
    path.rect(0, -w / 2, w, wallThickness + w);
    return path;
  }

  canResize() {
    return true;
  }
}
