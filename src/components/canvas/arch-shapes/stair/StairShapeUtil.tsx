import { BaseBoxShapeUtil, TLBaseShape, T, HTMLContainer } from 'tldraw';

/** 楼梯类型 */
export type StairType = 'double-run' | 'single-run' | 'spiral';

/** 楼梯形状 */
export type StairShape = TLBaseShape<
  'arch-stair',
  {
    w: number;
    h: number;
    stairType: StairType;
    stepCount: number; // 每跑踏步数
    direction: 'up' | 'down'; // 上行/下行
    color: string;
    showArrow: boolean;
  }
>;

/** 楼梯 ShapeUtil */
export class StairShapeUtil extends BaseBoxShapeUtil<any> {
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

  getDefaultProps(): StairShape['props'] {
    return {
      w: 120,
      h: 200,
      stairType: 'double-run',
      stepCount: 10,
      direction: 'up',
      color: '#1a1a1a',
      showArrow: true,
    };
  }

  component(shape: StairShape) {
    const { w, h, stairType, stepCount, direction, color, showArrow } = shape.props;

    return (
      <HTMLContainer
        style={{ width: w, height: h, position: 'relative', overflow: 'visible' }}
      >
        <svg
          width={w + 10}
          height={h + 10}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
        >
          {stairType === 'double-run' && (
            <g>
              {/* 外墙轮廓 */}
              <rect x={5} y={5} width={w} height={h} fill="none" stroke={color} strokeWidth={1.2} />

              {/* 中间隔墙（楼梯井） */}
              <line x1={5 + w / 2} y1={5} x2={5 + w / 2} y2={5 + h} stroke={color} strokeWidth={1} strokeDasharray="4,2" />

              {/* 上跑踏步 */}
              {Array.from({ length: stepCount }).map((_, i) => {
                const stepHeight = (h / 2 - 10) / stepCount;
                const y = 5 + 5 + i * stepHeight;
                return (
                  <line
                    key={`up-${i}`}
                    x1={5}
                    y1={y}
                    x2={5 + w / 2}
                    y2={y}
                    stroke={color}
                    strokeWidth={0.8}
                  />
                );
              })}

              {/* 下跑踏步 */}
              {Array.from({ length: stepCount }).map((_, i) => {
                const stepHeight = (h / 2 - 10) / stepCount;
                const y = 5 + h / 2 + 5 + i * stepHeight;
                return (
                  <line
                    key={`down-${i}`}
                    x1={5 + w / 2}
                    y1={y}
                    x2={5 + w}
                    y2={y}
                    stroke={color}
                    strokeWidth={0.8}
                  />
                );
              })}

              {/* 上下行箭头 */}
              {showArrow && (
                <>
                  {/* 上行箭头（左跑，从下往上） */}
                  <line
                    x1={5 + w / 4}
                    y1={5 + h / 2 - 10}
                    x2={5 + w / 4}
                    y2={5 + 15}
                    stroke={color}
                    strokeWidth={1.2}
                    markerEnd="url(#arrowhead)"
                  />
                  {/* 下行箭头（右跑，从上往下） */}
                  <line
                    x1={5 + (w * 3) / 4}
                    y1={5 + h / 2 + 15}
                    x2={5 + (w * 3) / 4}
                    y2={5 + h - 15}
                    stroke={color}
                    strokeWidth={1.2}
                    markerEnd="url(#arrowhead)"
                  />
                  <text x={5 + w / 4 - 12} y={5 + h / 4} fontSize={10} fill={color} fontFamily="Arial">上</text>
                  <text x={5 + (w * 3) / 4 + 4} y={5 + (h * 3) / 4} fontSize={10} fill={color} fontFamily="Arial">下</text>
                </>
              )}

              {/* 箭头定义 */}
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill={color} />
                </marker>
              </defs>
            </g>
          )}

          {stairType === 'single-run' && (
            <g>
              <rect x={5} y={5} width={w} height={h} fill="none" stroke={color} strokeWidth={1.2} />
              {Array.from({ length: stepCount }).map((_, i) => {
                const stepHeight = (h - 10) / stepCount;
                const y = 5 + 5 + i * stepHeight;
                return <line key={i} x1={5} y1={y} x2={5 + w} y2={y} stroke={color} strokeWidth={0.8} />;
              })}
              {showArrow && (
                <>
                  <line x1={5 + w / 2} y1={5 + h - 15} x2={5 + w / 2} y2={5 + 15} stroke={color} strokeWidth={1.2} />
                  <polygon points={`${5 + w / 2 - 4},${5 + 20} ${5 + w / 2 + 4},${5 + 20} ${5 + w / 2},${5 + 12}`} fill={color} />
                  <text x={5 + w / 2 + 6} y={5 + h / 2} fontSize={10} fill={color}>{direction === 'up' ? '上' : '下'}</text>
                </>
              )}
            </g>
          )}
        </svg>
      </HTMLContainer>
    );
  }

  getIndicatorPath(shape: StairShape) {
    const { w, h } = shape.props;
    const path = new Path2D();
    path.rect(0, 0, w, h);
    return path;
  }

  canResize() {
    return true;
  }
}
