import { ShapeUtil, TLBaseShape, T, Geometry2d, Rectangle2d, TLHandle } from 'tldraw';

/** 尺寸标注形状 */
export type DimensionShape = TLBaseShape<
  'arch-dimension',
  {
    start: { x: number; y: number };
    end: { x: number; y: number };
    offset: number; // 标注线偏移距离
    text: string; // 尺寸文字（空则自动计算）
    color: string;
    fontSize: number;
  }
>;

/** 尺寸标注 ShapeUtil */
export class DimensionShapeUtil extends ShapeUtil<any> {
  static type = 'arch-dimension' as const;

  static props = {
    start: T.object({ x: T.number, y: T.number }),
    end: T.object({ x: T.number, y: T.number }),
    offset: T.number,
    text: T.string,
    color: T.string,
    fontSize: T.number,
  };

  getDefaultProps(): DimensionShape['props'] {
    return {
      start: { x: 0, y: 0 },
      end: { x: 200, y: 0 },
      offset: 30,
      text: '',
      color: '#1a1a1a',
      fontSize: 12,
    };
  }

  getGeometry(shape: DimensionShape): Geometry2d {
    const { start, end, offset } = shape.props;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const nx = -dy / (length || 1);
    const ny = dx / (length || 1);
    const midX = (start.x + end.x) / 2 + nx * offset;
    const midY = (start.y + end.y) / 2 + ny * offset;
    return new Rectangle2d({
      x: midX - length / 2 - 20,
      y: midY - 20,
      width: length + 40,
      height: 40,
      isFilled: false,
    } as any);
  }

  component(shape: DimensionShape) {
    const { start, end, offset, text, color, fontSize } = shape.props;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const nx = -dy / (length || 1);
    const ny = dx / (length || 1);

    // 标注线的起点和终点（偏移后）
    const dimStart = { x: start.x + nx * offset, y: start.y + ny * offset };
    const dimEnd = { x: end.x + nx * offset, y: end.y + ny * offset };

    // 尺寸界线端点
    const extStart1 = { x: start.x + nx * (offset - 8), y: start.y + ny * (offset - 8) };
    const extStart2 = { x: start.x + nx * (offset + 8), y: start.y + ny * (offset + 8) };
    const extEnd1 = { x: end.x + nx * (offset - 8), y: end.y + ny * (offset + 8) };
    const extEnd2 = { x: end.x + nx * (offset + 8), y: end.y + ny * (offset + 8) };

    // 尺寸文字
    const dimensionText = text || `${Math.round(length * 10)}`; // 假设1:100比例，像素*10=mm
    const midX = (dimStart.x + dimEnd.x) / 2;
    const midY = (dimStart.y + dimEnd.y) / 2;

    // 箭头大小
    const arrowSize = 6;

    return (
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
      >
        {/* 尺寸界线 */}
        <line x1={extStart1.x} y1={extStart1.y} x2={extStart2.x} y2={extStart2.y} stroke={color} strokeWidth={0.8} />
        <line x1={extEnd1.x} y1={extEnd1.y} x2={extEnd2.x} y2={extEnd2.y} stroke={color} strokeWidth={0.8} />

        {/* 尺寸线 */}
        <line x1={dimStart.x} y1={dimStart.y} x2={dimEnd.x} y2={dimEnd.y} stroke={color} strokeWidth={0.8} />

        {/* 箭头（45度斜线） */}
        <line
          x1={dimStart.x}
          y1={dimStart.y}
          x2={dimStart.x + Math.cos(angle + 2.5) * arrowSize}
          y2={dimStart.y + Math.sin(angle + 2.5) * arrowSize}
          stroke={color}
          strokeWidth={0.8}
        />
        <line
          x1={dimStart.x}
          y1={dimStart.y}
          x2={dimStart.x + Math.cos(angle - 2.5) * arrowSize}
          y2={dimStart.y + Math.sin(angle - 2.5) * arrowSize}
          stroke={color}
          strokeWidth={0.8}
        />
        <line
          x1={dimEnd.x}
          y1={dimEnd.y}
          x2={dimEnd.x - Math.cos(angle + 2.5) * arrowSize}
          y2={dimEnd.y - Math.sin(angle + 2.5) * arrowSize}
          stroke={color}
          strokeWidth={0.8}
        />
        <line
          x1={dimEnd.x}
          y1={dimEnd.y}
          x2={dimEnd.x - Math.cos(angle - 2.5) * arrowSize}
          y2={dimEnd.y - Math.sin(angle - 2.5) * arrowSize}
          stroke={color}
          strokeWidth={0.8}
        />

        {/* 尺寸文字 */}
        <text
          x={midX}
          y={midY - 4}
          textAnchor="middle"
          dominantBaseline="auto"
          fontSize={fontSize}
          fill={color}
          fontFamily="Arial, sans-serif"
          transform={`rotate(${(angle * 180) / Math.PI} ${midX} ${midY})`}
          style={{ background: '#fff', padding: '0 4px' }}
        >
          {dimensionText}
        </text>
      </svg>
    );
  }

  getIndicatorPath(shape: DimensionShape) {
    const { start, end, offset } = shape.props;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / (length || 1);
    const ny = dx / (length || 1);
    const path = new Path2D();
    path.moveTo(start.x + nx * offset, start.y + ny * offset);
    path.lineTo(end.x + nx * offset, end.y + ny * offset);
    return path;
  }

  getHandles(shape: DimensionShape): TLHandle[] {
    return [
      { id: 'start', type: 'vertex', index: 0 as any, x: shape.props.start.x, y: shape.props.start.y },
      { id: 'end', type: 'vertex', index: 1 as any, x: shape.props.end.x, y: shape.props.end.y },
    ];
  }

  onHandleDrag(shape: DimensionShape, info: any): any {
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
}
