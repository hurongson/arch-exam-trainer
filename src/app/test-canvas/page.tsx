'use client';

import { Tldraw, createTLStore, defaultShapeUtils } from 'tldraw';
import 'tldraw/tldraw.css';
import { useMemo } from 'react';

/**
 * 最小化tldraw测试页面
 * 只包含最基本的tldraw用法，无任何自定义形状/工具栏/底图
 * 用于定位画布无法交互的根本原因
 */
export default function TestCanvasPage() {
  // 最简单的store初始化，只使用原生形状
  const store = useMemo(() => {
    return createTLStore({
      shapeUtils: defaultShapeUtils,
    });
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#fff' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, background: '#fff', padding: '8px 12px', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: 14 }}>
        测试页面：纯tldraw原生画布 | 请尝试缩放/平移/绘制
      </div>
      <Tldraw store={store} />
    </div>
  );
}
