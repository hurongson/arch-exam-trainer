import { BaseBoxShapeUtil, TLBaseShape, T, HTMLContainer } from 'tldraw';

/** 轴号形状 */
export type AxisLabelShape = TLBaseShape<
  'arch-axis-label',
  {
    w: number;
    h: number;
    label: string; // 轴号文字（A/B/C... 或 1/2/3...）
    hasLeader: boolean; // 是否有引线
    leaderDirection: 'top' | 'bottom' | 'left' | 'right';
    color: string;
  }
>;

/** 轴号 ShapeUtil - 圆圈内文字+引线 */
export class AxisLabelShapeUtil extends BaseBoxShapeUtil<any> {
  static type = 'arch-axis-label' as const;

  static props = {
    w: T.number,
    h: T.number,
    label: T.string,
    hasLeader: T.boolean,
    leaderDirection: T.string,
    color: T.string,
  };

  getDefaultProps(): AxisLabelShape['props'] {
    return {
      w: 28,
      h: 28,
      label: 'A',
      hasLeader: true,
      leaderDirection: 'bottom',
      color: '#1a1a1a',
    };
  }

  component(shape: AxisLabelShape) {
    const { w, h, label, hasLeader, leaderDirection, color } = shape.props;
    const radius = Math.min(w, h) / 2;
    const leaderLength = 40;

    return (
      <HTMLContainer
        style={{
          width: w + (hasLeader ? leaderLength : 0),
          height: h + (hasLeader ? leaderLength : 0),
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <svg
          width={w + (hasLeader ? leaderLength : 0) + 10}
          height={h + (hasLeader ? leaderLength : 0) + 10}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
        >
          {/* 引线 */}
          {hasLeader && (
            <>
              {leaderDirection === 'bottom' && (
                <line x1={w / 2 + 5} y1={h + 5} x2={w / 2 + 5} y2={h + leaderLength + 5} stroke={color} strokeWidth={1} />
              )}
              {leaderDirection === 'top' && (
                <line x1={w / 2 + 5} y1={5} x2={w / 2 + 5} y2={-leaderLength + 5} stroke={color} strokeWidth={1} />
              )}
              {leaderDirection === 'left' && (
                <line x1={5} y1={h / 2 + 5} x2={-leaderLength + 5} y2={h / 2 + 5} stroke={color} strokeWidth={1} />
              )}
              {leaderDirection === 'right' && (
                <line x1={w + 5} y1={h / 2 + 5} x2={w + leaderLength + 5} y2={h / 2 + 5} stroke={color} strokeWidth={1} />
              )}
            </>
          )}

          {/* 圆圈 */}
          <circle
            cx={w / 2 + 5}
            cy={h / 2 + 5}
            r={radius - 1}
            fill="#ffffff"
            stroke={color}
            strokeWidth={1.2}
          />

          {/* 文字 */}
          <text
            x={w / 2 + 5}
            y={h / 2 + 5}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={radius * 0.9}
            fill={color}
            fontFamily="Arial, sans-serif"
            fontWeight="500"
          >
            {label}
          </text>
        </svg>
      </HTMLContainer>
    );
  }

  getIndicatorPath(shape: AxisLabelShape) {
    const { w, h } = shape.props;
    const path = new Path2D();
    path.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
    return path;
  }

  canResize() {
    return false;
  }
}
