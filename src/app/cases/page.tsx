'use client';

import { useState } from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  Ruler,
  Lightbulb,
  Target,
  Search,
  Tag,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import AppLayout from '@/components/layout/AppLayout';
import { ImageViewer } from '@/components/ImageViewer';
import casesData from '@/../data/cases.json';
import type { ArchCase } from '@/types';

export default function CasesPage() {
  const [search, setSearch] = useState('');
  const [selectedCase, setSelectedCase] = useState<ArchCase | null>(null);

  const cases = casesData as ArchCase[];

  const filteredCases = cases.filter(
    (c) =>
      c.name.includes(search) ||
      c.architect.includes(search) ||
      c.location.includes(search) ||
      c.tags.some((t) => t.includes(search))
  );

  return (
    <AppLayout>
      <Sidebar />
      <main className="ml-56 min-h-screen p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">建筑案例库</h1>
          <p className="mt-1 text-sm text-gray-500">
            优秀建筑案例平立面分析，积累方案设计素材（每日推送至飞书）
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索案例名称、建筑师、地点、标签..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Case List */}
          <div className="col-span-1 space-y-3">
            {filteredCases.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  selectedCase?.id === c.id
                    ? 'border-primary-300 bg-primary-50/50 shadow-sm'
                    : 'border-gray-100 bg-white hover:border-primary-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <Building2 className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-gray-900">{c.name}</div>
                    <div className="mt-0.5 truncate text-xs text-gray-500">{c.architect}</div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                      <span>{c.location}</span>
                      <span>·</span>
                      <span>{c.year}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Case Detail */}
          <div className="col-span-2">
            {selectedCase ? (
              <div className="rounded-xl border border-gray-100 bg-white p-6">
                <h2 className="text-xl font-bold text-gray-900">{selectedCase.name}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {selectedCase.architect}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedCase.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {selectedCase.year}年
                  </span>
                  {selectedCase.area && selectedCase.area > 0 && (
                    <span className="flex items-center gap-1">
                      <Ruler className="h-4 w-4" />
                      {selectedCase.area.toLocaleString()}㎡
                    </span>
                  )}
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                    {selectedCase.buildingType}
                  </span>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {selectedCase.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h3 className="mb-2 text-sm font-semibold text-gray-900">项目描述</h3>
                  <p className="text-sm leading-relaxed text-gray-700">{selectedCase.description}</p>
                </div>

                {/* Case Images */}
                {selectedCase.images && selectedCase.images.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                      图纸分析
                      <span className="text-xs font-normal text-gray-400">（点击图片可放大缩放查看）</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedCase.images.map((img, i) => (
                        <div key={i}>
                          <div className="mb-1.5 flex items-center gap-2 px-1">
                            <span className="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700">
                              {img.type === 'site' ? '总平' :
                               img.type === 'plan' ? '平面' :
                               img.type === 'elevation' ? '立面' :
                               img.type === 'section' ? '剖面' :
                               img.type === 'analysis' ? '分析' :
                               img.type === 'axonometric' ? '轴测' : '图纸'}
                            </span>
                            <span className="text-sm font-medium text-gray-900">{img.title}</span>
                          </div>
                          <ImageViewer src={img.url} alt={img.title} />
                          {img.description && (
                            <p className="mt-1.5 px-1 text-xs leading-relaxed text-gray-500">{img.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Drawing Analysis */}
                {selectedCase.drawingAnalysis && selectedCase.drawingAnalysis.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <Target className="h-4 w-4 text-primary-600" />
                      图纸详细解读
                    </h3>
                    <div className="space-y-5">
                      {selectedCase.drawingAnalysis.map((da, idx) => (
                        <div key={idx} className="overflow-hidden rounded-lg border border-gray-200">
                          <div className="border-b border-gray-100 bg-gray-50 px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700">
                                {da.type === 'site' ? '总平' :
                                 da.type === 'plan' ? '平面' :
                                 da.type === 'elevation' ? '立面' :
                                 da.type === 'section' ? '剖面' :
                                 da.type === 'axonometric' ? '轴测' : '分析'}
                              </span>
                              <span className="text-sm font-semibold text-gray-900">{da.title}</span>
                            </div>
                          </div>
                          {da.imageUrl && (
                            <div className="bg-gray-50 p-3">
                              <ImageViewer src={da.imageUrl} alt={da.title} />
                            </div>
                          )}
                          <div className="p-4">
                            <ul className="space-y-2">
                              {da.analysis.map((point, i) => (
                                <li key={i} className="flex gap-2 text-sm leading-relaxed text-gray-700">
                                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-[11px] font-semibold text-primary-700">
                                    {i + 1}
                                  </span>
                                  {point}
                                </li>
                              ))}
                            </ul>
                            {da.keyPoints && da.keyPoints.length > 0 && (
                              <div className="mt-3 border-t border-gray-100 pt-3">
                                <p className="mb-1.5 text-xs font-semibold text-gray-500">关键要点：</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {da.keyPoints.map((kp, i) => (
                                    <span
                                      key={i}
                                      className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700"
                                    >
                                      {kp}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Design Highlights */}
                <div className="mt-6">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    设计亮点
                  </h3>
                  <ul className="space-y-2">
                    {selectedCase.designHighlights.map((h, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-gray-700">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-semibold text-amber-700">
                          {i + 1}
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exam Relevance */}
                <div className="mt-6 rounded-xl border border-primary-100 bg-primary-50/50 p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary-800">
                    <Target className="h-4 w-4" />
                    一注考点关联
                  </h3>
                  <ul className="space-y-1.5">
                    {selectedCase.examRelevance.map((r, i) => (
                      <li key={i} className="flex gap-2 text-sm text-primary-700">
                        <span className="text-primary-400">→</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-xl border border-gray-100 bg-white">
                <div className="text-center">
                  <Building2 className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-sm text-gray-400">选择左侧案例查看详情</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
