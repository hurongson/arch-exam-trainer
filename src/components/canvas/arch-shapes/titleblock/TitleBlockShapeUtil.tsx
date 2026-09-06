import { BaseBoxShapeUtil, TLBaseShape, T, HTMLContainer } from 'tldraw';

/** 图幅类型 */
export type SheetSize = 'A1' | 'A2' | 'A3' | 'A4';

/** 图幅尺寸（mm，按1:100比例，像素=mm/10） */
export const SHEET_DIMENSIONS: Record<SheetSize, { w: number; h: number }> = {
  A1: { w: 841, h: 594 }, // 841x594mm -> 84x59px (1:10)
  A2: { w: 594, h: 420 },
  A3: { w: 420, h: 297 },
  A4: { w: 297, h: 210 },
};

/** 图框形状 */
export type TitleBlockShape = TLBaseShape<
  'arch-titleblock',
  {
    w: number;
    h: number;
    sheetSize: SheetSize;
    projectName: string;
    drawingName: string;
    drawingNumber: string;
    scale: string;
    designer: string;
    date: string;
    color: string;
    showTitleBlock: boolean;
  }
>;

/** 图框 ShapeUtil */
export class TitleBlockShapeUtil extends BaseBoxShapeUtil<any> {
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

  getDefaultProps(): TitleBlockShape['props'] {
    const dims = SHEET_DIMENSIONS.A2;
    return {
      w: dims.w,
      h: dims.h,
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

  component(shape: TitleBlockShape) {
    const { w, h, projectName, drawingName, drawingNumber, scale, designer, date, color, showTitleBlock } = shape.props;
    const margin = 10; // 图框边距
    const titleBlockWidth = 120;
    const titleBlockHeight = 40;

    return (
      <HTMLContainer
        style={{ width: w, height: h, position: 'relative', overflow: 'visible' }}
      >
        <svg
          width={w}
          height={h}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
        >
          {/* 外框（纸边界） */}
          <rect x={0} y={0} width={w} height={h} fill="#ffffff" stroke={color} strokeWidth={0.5} strokeDasharray="2,2" />

          {/* 内框（图框） */}
          <rect x={margin} y={margin} width={w - margin * 2} height={h - margin * 2} fill="none" stroke={color} strokeWidth={1.2} />

          {/* 标题栏 */}
          {showTitleBlock && (
            <g>
              {/* 标题栏外框 */}
              <rect
                x={w - margin - titleBlockWidth}
                y={h - margin - titleBlockHeight}
                width={titleBlockWidth}
                height={titleBlockHeight}
                fill="none"
                stroke={color}
                strokeWidth={1}
              />

              {/* 标题栏分隔线 */}
              <line
                x1={w - margin - titleBlockWidth}
                y1={h - margin - titleBlockHeight + 13}
                x2={w - margin}
                y2={h - margin - titleBlockHeight + 13}
                stroke={color}
                strokeWidth={0.5}
              />
              <line
                x1={w - margin - titleBlockWidth}
                y1={h - margin - titleBlockHeight + 26}
                x2={w - margin}
                y2={h - margin - titleBlockHeight + 26}
                stroke={color}
                strokeWidth={0.5}
              />
              <line
                x1={w - margin - titleBlockWidth + 60}
                y1={h - margin - titleBlockHeight + 13}
                x2={w - margin - titleBlockWidth + 60}
                y2={h - margin}
                stroke={color}
                strokeWidth={0.5}
              />

              {/* 标题栏文字 */}
              <text x={w - margin - titleBlockWidth + 5} y={h - margin - titleBlockHeight + 9} fontSize={7} fill={color} fontFamily="Arial">
                {projectName}
              </text>
              <text x={w - margin - titleBlockWidth + 5} y={h - margin - titleBlockHeight + 22} fontSize={8} fill={color} fontFamily="Arial" fontWeight="bold">
                {drawingName}
              </text>
              <text x={w - margin - titleBlockWidth + 5} y={h - margin - titleBlockHeight + 35} fontSize={6} fill={color} fontFamily="Arial">
                设计：{designer || '___'}
              </text>
              <text x={w - margin - titleBlockWidth + 65} y={h - margin - titleBlockHeight + 22} fontSize={6} fill={color} fontFamily="Arial">
                图号：{drawingNumber}
              </text>
              <text x={w - margin - titleBlockWidth + 65} y={h - margin - titleBlockHeight + 35} fontSize={6} fill={color} fontFamily="Arial">
                比例：{scale}
              </text>
              <text x={w - margin - 25} y={h - margin - 3} fontSize={5} fill={color} fontFamily="Arial" textAnchor="end">
                {date}
              </text>
            </g>
          )}

          {/* 会签栏（左侧） */}
          <g transform={`translate(${margin + 2}, ${h / 2 - 30}) rotate(-90)`}>
            <rect x={0} y={0} width={60} height={15} fill="none" stroke={color} strokeWidth={0.5} />
            <text x={30} y={10} fontSize={6} fill={color} fontFamily="Arial" textAnchor="middle">
              会签栏
            </text>
          </g>
        </svg>
      </HTMLContainer>
    );
  }

  getIndicatorPath(shape: TitleBlockShape) {
    const { w, h } = shape.props;
    const path = new Path2D();
    path.rect(0, 0, w, h);
    return path;
  }

  canResize() {
    return false;
  }

  isAspectRatioLocked() {
    return true;
  }
}
