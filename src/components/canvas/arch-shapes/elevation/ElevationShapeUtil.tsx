import { BaseBoxShapeUtil, TLBaseShape, T, HTMLContainer } from 'tldraw';

/** 标高形状 */
export type ElevationShape = TLBaseShape<
  'arch-elevation',
  {
    w: number;
    h: number;
    elevation: string; // 标高值，如 ±0.000、3.600
    direction: 'up' | 'down'; // 三角形指向
    color: string;
  }
>;

/** 标高 ShapeUtil - 三角形标高符号+横线+文字 */
export class ElevationShapeUtil extends BaseBoxShapeUtil<any> {
  static type = 'arch-elevation' as const;

  static props = {
    w: T.number,
    h: T.number,
    elevation: T.string,
    direction: T.string,
    color: T.string,
  };

  getDefaultProps(): ElevationShape['props'] {
    return {
      w: 80,
      h: 24,
      elevation: '±0.000',
      direction: 'down',
      color: '#1a1a1a',
    };
  }

  component(shape: ElevationShape) {
    const { w, h, elevation, direction, color } = shape.props;
    const triangleSize = 10;
    const lineLength = w - triangleSize;

    return (
      <HTMLContainer
        style={{
          width: w,
          height: h,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <svg
          width={w + 10}
          height={h + 10}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
        >
          {direction === 'down' ? (
            <>
              {/* 向下三角形 */}
              <polygon
                points={`5,${h / 2 + 5} ${5 + triangleSize},${h / 2 + 5 - triangleSize / 2} ${5 + triangleSize},${h / 2 + 5 + triangleSize / 2}`}
                fill="#ffffff"
                stroke={color}
                strokeWidth={1}
              />
              {/* 横线 */}
              <line x1={5 + triangleSize} y1={h / 2 + 5} x2={w + 5} y2={h / 2 + 5} stroke={color} strokeWidth={1} />
              {/* 文字 */}
              <text
                x={5 + triangleSize + 5}
                y={h / 2 + 2}
                textAnchor="start"
                dominantBaseline="auto"
                fontSize={11}
                fill={color}
                fontFamily="Arial, sans-serif"
              >
                {elevation}
              </text>
            </>
          ) : (
            <>
              {/* 向上三角形 */}
              <polygon
                points={`${w + 5},${h / 2 + 5} ${w + 5 - triangleSize},${h / 2 + 5 - triangleSize / 2} ${w + 5 - triangleSize},${h / 2 + 5 + triangleSize / 2}`}
                fill="#ffffff"
                stroke={color}
                strokeWidth={1}
              />
              {/* 横线 */}
              <line x1={5} y1={h / 2 + 5} x2={w + 5 - triangleSize} y2={h / 2 + 5} stroke={color} strokeWidth={1} />
              {/* 文字 */}
              <text
                x={w + 5 - triangleSize - 5}
                y={h / 2 + 2}
                textAnchor="end"
                dominantBaseline="auto"
                fontSize={11}
                fill={color}
                fontFamily="Arial, sans-serif"
              >
                {elevation}
              </text>
            </>
          )}
        </svg>
      </HTMLContainer>
    );
  }

  getIndicatorPath(shape: ElevationShape) {
    const { w, h } = shape.props;
    const path = new Path2D();
    path.rect(0, 0, w, h);
    return path;
  }

  canResize() {
    return true;
  }
}
