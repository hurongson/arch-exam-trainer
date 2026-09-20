import { ShapeUtil, T, Rectangle2d, Geometry2d } from 'tldraw';

/** 图幅尺寸 */
export const SHEET_DIMENSIONS = {
  A1: { w: 841, h: 594 },
  A2: { w: 594, h: 420 },
  A3: { w: 420, h: 297 },
  A4: { w: 297, h: 210 },
};

/** 图框形状 - 简化稳定版 */
export class TitleBlockShapeUtil extends ShapeUtil<any> {
  static type = 'arch-titleblock' as const;

  static props = {
    w: T.number,
    h: T.number,
    sheetSize: T.string,
    projectName: T.string,
    drawingName: T.string,
    drawingNumber: T.string,
    scale: T.string,
    designer: T.string,
    date: T.string,
    color: T.string,
    showTitleBlock: T.boolean,
  };

  getDefaultProps() {
    return {
      w: 594,
      h: 420,
      sheetSize: 'A2',
      projectName: '一级注册建筑师考试',
      drawingName: '建筑方案设计',
      drawingNumber: '建施-01',
      scale: '1:200',
      designer: '',
      date: new Date().toISOString().slice(0, 10),
      color: '#1a1a1a',
      showTitleBlock: true,
    };
  }

  getGeometry(shape: any): Geometry2d {
    return new Rectangle2d({ x: 0, y: 0, width: shape.props.w, height: shape.props.h, isFilled: false });
  }

  component(shape: any) {
    const { w, h, projectName, drawingName, drawingNumber, scale, designer, date, color, showTitleBlock } = shape.props;
    const margin = 10;
    const titleBlockW = 180;
    const titleBlockH = 50;

    return (
      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}>
        {/* 外框 */}
        <rect x={0} y={0} width={w} height={h} fill="#ffffff" fillOpacity={0.3} stroke={color} strokeWidth={1.5} />
        {/* 内框 */}
        <rect x={margin} y={margin} width={w - margin * 2} height={h - margin * 2} fill="none" stroke={color} strokeWidth={0.5} />

        {showTitleBlock && (
          <>
            {/* 标题栏外框 */}
            <rect x={w - margin - titleBlockW} y={h - margin - titleBlockH} width={titleBlockW} height={titleBlockH} fill="none" stroke={color} strokeWidth={1} />
            {/* 标题栏分隔线 */}
            <line x1={w - margin - titleBlockW} y1={h - margin - titleBlockH + 25} x2={w - margin} y2={h - margin - titleBlockH + 25} stroke={color} strokeWidth={0.5} />
            <line x1={w - margin - titleBlockW / 2} y1={h - margin - titleBlockH} x2={w - margin - titleBlockW / 2} y2={h - margin - titleBlockH + 25} stroke={color} strokeWidth={0.5} />
            {/* 工程名称 */}
            <text x={w - margin - titleBlockW + 5} y={h - margin - titleBlockH + 16} fontSize={10} fontWeight="bold" fill={color} fontFamily="sans-serif">
              {projectName}
            </text>
            {/* 图名 */}
            <text x={w - margin - titleBlockW + 5} y={h - margin - titleBlockH + 40} fontSize={12} fontWeight="bold" fill={color} fontFamily="sans-serif">
              {drawingName}
            </text>
            {/* 图号 */}
            <text x={w - margin - titleBlockW / 2 + 5} y={h - margin - titleBlockH + 16} fontSize={9} fill={color} fontFamily="sans-serif">
              图号：{drawingNumber}
            </text>
            {/* 比例 */}
            <text x={w - margin - titleBlockW / 2 + 5} y={h - margin - titleBlockH + 40} fontSize={9} fill={color} fontFamily="sans-serif">
              比例：{scale}
            </text>
            {/* 设计/日期 */}
            <text x={w - margin - 80} y={h - margin - 5} fontSize={8} fill={color} fontFamily="sans-serif" textAnchor="end">
              {designer} {date}
            </text>
          </>
        )}
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
