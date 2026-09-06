'use client';

import { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Tldraw, createTLStore, defaultShapeUtils, type TLRecord } from 'tldraw';
import 'tldraw/tldraw.css';

export interface TldrawEditorHandle {
  getSnapshot: () => Promise<any>;
  loadSnapshot: (snapshot: any) => void;
  getStore: () => any;
}

interface TldrawEditorProps {
  initialData?: any;
  buildingType?: string;
}

/**
 * 专业建筑绘图画布
 * 基于 tldraw，定制建筑绘图工具
 */
const TldrawEditor = forwardRef<TldrawEditorHandle, TldrawEditorProps>(
  ({ initialData, buildingType }, ref) => {
    const [store, setStore] = useState<any>(null);

    useEffect(() => {
      // 创建 store
      const newStore = createTLStore({
        shapeUtils: defaultShapeUtils,
      });

      // 如果有初始数据，加载
      if (initialData?.store) {
        try {
          const records: TLRecord[] = [];
          // 遍历 snapshot 中的所有记录
          const allRecords = initialData.store?.document?.documents?.[0]?.root?.children;
          if (allRecords) {
            Object.values(allRecords).forEach((record: any) => {
              if (record && record.id) {
                records.push(record as TLRecord);
              }
            });
          }
          if (records.length > 0) {
            newStore.put(records);
          }
        } catch (e) {
          console.warn('加载初始方案数据失败', e);
        }
      }

      setStore(newStore);
    }, [initialData]);

    useImperativeHandle(ref, () => ({
      getSnapshot: async () => {
        if (!store) return null;
        // 获取所有记录
        const allRecords = store.allRecords();
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
          schema: store.schema,
          version: 1,
        };
      },
      loadSnapshot: (snapshot: any) => {
        if (!store || !snapshot?.store) return;
        const allRecords = snapshot.store?.document?.documents?.[0]?.root?.children;
        if (allRecords) {
          const records = Object.values(allRecords) as TLRecord[];
          store.put(records);
        }
      },
      getStore: () => store,
    }));

    if (!store) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-sm text-gray-400">画布加载中...</div>
        </div>
      );
    }

    return (
      <div className="h-full w-full">
        <Tldraw
          store={store}
          components={{
            // 可以自定义 UI 组件
          }}
          overrides={{
            // 可以覆盖默认行为
          }}
          initialState="select"
        />
        {/* 建筑工具提示层 */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-gray-900/80 px-4 py-1.5 text-xs text-white">
          提示：使用左侧工具栏绘制墙体、门窗、标注；按 R 矩形，L 直线，T 文字
        </div>
      </div>
    );
  }
);

TldrawEditor.displayName = 'TldrawEditor';

export default TldrawEditor;
