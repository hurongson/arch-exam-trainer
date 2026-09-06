'use client';

import { useRef, useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Tldraw, createTLStore, defaultShapeUtils, type Editor, type TLRecord } from 'tldraw';
import 'tldraw/tldraw.css';
import { archShapeUtils, ArchShapeTypes, WALL_THICKNESS, COLUMN_SIZES, SHEET_DIMENSIONS } from './arch-shapes';
import { ArchToolbar } from './ArchToolbar';
import type { BuildingType } from '@/types';

export interface ArchCanvasHandle {
  getSnapshot: () => Promise<any>;
  loadSnapshot: (snapshot: any) => void;
  getEditor: () => Editor | null;
  exportPNG: () => Promise<string | null>;
}

interface ArchCanvasProps {
  initialData?: any;
  buildingType?: BuildingType;
  onSave?: (snapshot: any) => void;
}

/**
 * 专业建筑绘图画布
 * 集成所有建筑自定义形状和工具栏
 */
export const ArchCanvas = forwardRef<ArchCanvasHandle, ArchCanvasProps>(
  function ArchCanvas({ initialData, buildingType, onSave }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const [store, setStore] = useState<any>(null);
  const [activeTool, setActiveTool] = useState<string>('select');

  // 初始化 store
  useEffect(() => {
    const newStore = createTLStore({
      shapeUtils: [...defaultShapeUtils, ...archShapeUtils] as any,
    });

    // 加载初始数据
    if (initialData?.store) {
      try {
        const allRecords = initialData.store?.document?.documents?.[0]?.root?.children;
        if (allRecords) {
          const records = Object.values(allRecords) as TLRecord[];
          if (records.length > 0) {
            newStore.put(records);
          }
        }
      } catch (e) {
        console.warn('加载初始方案数据失败', e);
      }
    }

    setStore(newStore);
  }, [initialData]);

  // 编辑器挂载回调
  const handleMount = useCallback((editor: Editor) => {
    editorRef.current = editor;

    // 设置默认样式
    editor.updateInstanceState({
      isGridMode: true, // 显示网格
    });

    // 设置网格大小（1:100比例，10px=100mm）
    editor.user.updateUserPreferences({
      // 可以设置用户偏好
    });
  }, []);

  // 创建墙
  const createWall = useCallback((wallType: 'exterior' | 'interior' | 'partition' = 'exterior') => {
    const editor = editorRef.current;
    if (!editor) return;

    const thickness = WALL_THICKNESS[wallType];
    const origin = editor.getViewportScreenCenter();
    const pagePoint = editor.pageToScreen({ x: origin.x - 100, y: origin.y });

    editor.createShape({
      type: ArchShapeTypes.WALL as any,
      x: pagePoint.x,
      y: pagePoint.y,
      props: {
        start: { x: 0, y: 0 },
        end: { x: 200, y: 0 },
        thickness,
        wallType,
        color: '#1a1a1a',
      },
    });

    editor.setCurrentTool('select');
    setActiveTool('select');
  }, []);

  // 创建门
  const createDoor = useCallback((doorType: 'swing' | 'sliding' | 'double' = 'swing') => {
    const editor = editorRef.current;
    if (!editor) return;

    const origin = editor.getViewportScreenCenter();
    const pagePoint = editor.screenToPage(origin);

    editor.createShape({
      type: ArchShapeTypes.DOOR as any,
      x: pagePoint.x - 45,
      y: pagePoint.y - 6,
      props: {
        w: 90,
        h: 12,
        doorType,
        swingDirection: 'right',
        color: '#1a1a1a',
        wallThickness: 24,
      },
    });

    editor.setCurrentTool('select');
    setActiveTool('select');
  }, []);

  // 创建窗
  const createWindow = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const origin = editor.getViewportScreenCenter();
    const pagePoint = editor.screenToPage(origin);

    editor.createShape({
      type: ArchShapeTypes.WINDOW as any,
      x: pagePoint.x - 75,
      y: pagePoint.y - 6,
      props: {
        w: 150,
        h: 12,
        windowType: 'fixed',
        color: '#1a1a1a',
        wallThickness: 24,
      },
    });

    editor.setCurrentTool('select');
    setActiveTool('select');
  }, []);

  // 创建柱
  const createColumn = useCallback((size: 'small' | 'medium' | 'large' = 'medium') => {
    const editor = editorRef.current;
    if (!editor) return;

    const dims = COLUMN_SIZES[size];
    const origin = editor.getViewportScreenCenter();
    const pagePoint = editor.screenToPage(origin);

    editor.createShape({
      type: ArchShapeTypes.COLUMN as any,
      x: pagePoint.x - dims.w / 2,
      y: pagePoint.y - dims.h / 2,
      props: {
        w: dims.w,
        h: dims.h,
        columnType: 'square',
        color: '#1a1a1a',
        filled: true,
      },
    });

    editor.setCurrentTool('select');
    setActiveTool('select');
  }, []);

  // 创建尺寸标注
  const createDimension = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const origin = editor.getViewportScreenCenter();
    const pagePoint = editor.screenToPage(origin);

    editor.createShape({
      type: ArchShapeTypes.DIMENSION as any,
      x: pagePoint.x - 100,
      y: pagePoint.y - 30,
      props: {
        start: { x: 0, y: 30 },
        end: { x: 200, y: 30 },
        offset: 30,
        text: '',
        color: '#1a1a1a',
        fontSize: 12,
      },
    });

    editor.setCurrentTool('select');
    setActiveTool('select');
  }, []);

  // 创建轴号
  const createAxisLabel = useCallback((label: string = 'A') => {
    const editor = editorRef.current;
    if (!editor) return;

    const origin = editor.getViewportScreenCenter();
    const pagePoint = editor.screenToPage(origin);

    editor.createShape({
      type: ArchShapeTypes.AXIS_LABEL as any,
      x: pagePoint.x - 14,
      y: pagePoint.y - 14,
      props: {
        w: 28,
        h: 28,
        label,
        hasLeader: true,
        leaderDirection: 'bottom',
        color: '#1a1a1a',
      },
    });

    editor.setCurrentTool('select');
    setActiveTool('select');
  }, []);

  // 创建标高
  const createElevation = useCallback((elevation: string = '±0.000') => {
    const editor = editorRef.current;
    if (!editor) return;

    const origin = editor.getViewportScreenCenter();
    const pagePoint = editor.screenToPage(origin);

    editor.createShape({
      type: ArchShapeTypes.ELEVATION as any,
      x: pagePoint.x - 40,
      y: pagePoint.y - 12,
      props: {
        w: 80,
        h: 24,
        elevation,
        direction: 'down',
        color: '#1a1a1a',
      },
    });

    editor.setCurrentTool('select');
    setActiveTool('select');
  }, []);

  // 创建楼梯
  const createStair = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const origin = editor.getViewportScreenCenter();
    const pagePoint = editor.screenToPage(origin);

    editor.createShape({
      type: ArchShapeTypes.STAIR as any,
      x: pagePoint.x - 60,
      y: pagePoint.y - 100,
      props: {
        w: 120,
        h: 200,
        stairType: 'double-run',
        stepCount: 10,
        direction: 'up',
        color: '#1a1a1a',
        showArrow: true,
      },
    });

    editor.setCurrentTool('select');
    setActiveTool('select');
  }, []);

  // 插入图框
  const insertTitleBlock = useCallback((sheetSize: 'A1' | 'A2' | 'A3' | 'A4' = 'A2') => {
    const editor = editorRef.current;
    if (!editor) return;

    const dims = SHEET_DIMENSIONS[sheetSize];

    editor.createShape({
      type: ArchShapeTypes.TITLE_BLOCK as any,
      x: 0,
      y: 0,
      props: {
        w: dims.w,
        h: dims.h,
        sheetSize,
        projectName: '一级注册建筑师考试',
        drawingName: '建筑方案设计',
        drawingNumber: '建施-01',
        scale: '1:200',
        designer: '',
        date: new Date().toISOString().slice(0, 10),
        color: '#1a1a1a',
        showTitleBlock: true,
      },
    });

    // 缩放到图框
    editor.zoomToFit();
    editor.setCurrentTool('select');
    setActiveTool('select');
  }, []);

  // 获取快照
  const getSnapshot = useCallback(async () => {
    const editor = editorRef.current;
    if (!editor) return null;

    const allRecords = editor.store.allRecords();
    return {
      store: {
        document: {
          documents: [
            {
              root: {
                children: allRecords.reduce((acc: Record<string, any>, record: any) => {
                  acc[record.id] = record;
                  return acc;
                }, {}),
              },
            },
          ],
        },
      },
      schema: editor.store.schema,
      version: 1,
    };
  }, []);

  // 导出 PNG
  const exportPNG = useCallback(async (): Promise<string | null> => {
    const editor = editorRef.current;
    if (!editor) return null;

    try {
      // 获取当前页所有形状的边界
      const shapes = editor.getCurrentPageShapes();
      if (shapes.length === 0) return null;

      const bounds = editor.getSelectionPageBounds() || editor.getCurrentPageBounds();
      if (!bounds) return null;

      // 使用 tldraw 的导出功能
      const svg = await (editor as any).getSvg(shapes, {
        background: true,
        padding: 20,
      });

      if (!svg) return null;

      // SVG 转 PNG
      const svgString = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const scale = 2; // 2倍分辨率
      canvas.width = bounds.width * scale + 40;
      canvas.height = bounds.height * scale + 40;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      return new Promise((resolve) => {
        img.onload = () => {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 20, 20, bounds.width * scale, bounds.height * scale);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(null);
        };
        img.src = url;
      });
    } catch (e) {
      console.error('导出PNG失败', e);
      return null;
    }
  }, []);

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    getSnapshot,
    loadSnapshot: (snapshot: any) => {
      // 加载快照逻辑
    },
    getEditor: () => editorRef.current,
    exportPNG,
  }), [getSnapshot, exportPNG]);

  if (!store) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-gray-400">画布加载中...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <Tldraw
        store={store}
        onMount={handleMount}
        components={{
          // 可以自定义UI组件
        }}
        overrides={{
          // 可以覆盖默认行为
        }}
        initialState="select"
      />

      {/* 建筑专业工具栏 */}
      <ArchToolbar
        activeTool={activeTool}
        onToolSelect={setActiveTool}
        onCreateWall={createWall}
        onCreateDoor={createDoor}
        onCreateWindow={createWindow}
        onCreateColumn={createColumn}
        onCreateDimension={createDimension}
        onCreateAxisLabel={createAxisLabel}
        onCreateElevation={createElevation}
        onCreateStair={createStair}
        onInsertTitleBlock={insertTitleBlock}
      />
    </div>
  );
});
