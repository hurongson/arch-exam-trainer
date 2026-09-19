'use client';

import { useState, useMemo } from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  Ruler,
  Lightbulb,
  Target,
  Search,
  Tag,
  Filter,
  GitCompare,
  X,
  Check,
  Layers,
  Home,
  Mountain,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import AppLayout from '@/components/layout/AppLayout';
import { ImageViewer } from '@/components/ImageViewer';
import casesData from '@/../data/cases.json';
import type { ArchCase, BuildingType } from '@/types';

// 筛选选项
const BUILDING_TYPES: (BuildingType | '全部')[] = ['全部', '交通', '医养', '服务', '文体', '商业', '居住', '工业科研'];
const REGIONS = ['全部', '华北', '华东', '华南', '华中', '西南', '西北', '东北', '海外'] as const;
const CLIMATE_ZONES = ['全部', '严寒', '寒冷', '夏热冬冷', '夏热冬暖', '温和', '海外'] as const;
const STRUCTURE_TYPES = ['全部', '框架', '剪力墙', '框架剪力墙', '钢结构', '砖混', '混凝土', '木结构', '混合结构'] as const;
const FLOOR_RANGES = [
  { label: '全部', min: 0, max: 999 },
  { label: '低层(1-3层)', min: 1, max: 3 },
  { label: '多层(4-6层)', min: 4, max: 6 },
  { label: '高层(>6层)', min: 7, max: 999 },
];
const PLOT_RATIO_RANGES = [
  { label: '全部', min: 0, max: 999 },
  { label: '低密(<1)', min: 0, max: 1 },
  { label: '中密(1-2)', min: 1, max: 2 },
  { label: '高密(>2)', min: 2, max: 999 },
];

export default function CasesPage() {
  const [search, setSearch] = useState('');
  const [selectedCase, setSelectedCase] = useState<ArchCase | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // 筛选状态
  const [filterType, setFilterType] = useState<BuildingType | '全部'>('全部');
  const [filterRegion, setFilterRegion] = useState<string>('全部');
  const [filterClimate, setFilterClimate] = useState<string>('全部');
  const [filterStructure, setFilterStructure] = useState<string>('全部');
  const [filterFloorRange, setFilterFloorRange] = useState(0);
  const [filterPlotRatio, setFilterPlotRatio] = useState(0);

  const cases = casesData as ArchCase[];

  // 筛选逻辑
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // 搜索
      const matchSearch =
        c.name.includes(search) ||
        c.architect.includes(search) ||
        c.location.includes(search) ||
        c.tags.some((t) => t.includes(search));
      if (!matchSearch) return false;

      // 建筑类型
      if (filterType !== '全部' && c.buildingType !== filterType) return false;

      // 地域
      if (filterRegion !== '全部' && c.region !== filterRegion) return false;

      // 气候
      if (filterClimate !== '全部' && c.climateZone !== filterClimate) return false;

      // 结构
      if (filterStructure !== '全部' && c.structureType !== filterStructure) return false;

      // 层数
      const floorRange = FLOOR_RANGES[filterFloorRange];
      if (c.floorCount && (c.floorCount < floorRange.min || c.floorCount > floorRange.max)) return false;

      // 容积率
      const ratioRange = PLOT_RATIO_RANGES[filterPlotRatio];
      if (c.plotRatio && (c.plotRatio < ratioRange.min || c.plotRatio >= ratioRange.max)) return false;

      return true;
    });
  }, [cases, search, filterType, filterRegion, filterClimate, filterStructure, filterFloorRange, filterPlotRatio]);

  // 对比案例
  const compareCases = useMemo(() => {
    return compareIds.map((id) => cases.find((c) => c.id === id)).filter(Boolean) as ArchCase[];
  }, [compareIds, cases]);

  // 切换对比选择
  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 3) {
        return prev; // 最多3个
      }
      return [...prev, id];
    });
  };

  // 重置筛选
  const resetFilters = () => {
    setFilterType('全部');
    setFilterRegion('全部');
    setFilterClimate('全部');
    setFilterStructure('全部');
    setFilterFloorRange(0);
    setFilterPlotRatio(0);
    setSearch('');
  };

  // 筛选按钮组件
  const FilterButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
        active
          ? 'bg-primary-600 text-white shadow-sm'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );

  return (
    <AppLayout>
      <Sidebar />
      <main className="ml-56 min-h-screen p-8">
        {/* 头部 */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">建筑案例库</h1>
            <p className="mt-1 text-sm text-gray-500">
              优秀建筑案例平立面分析，积累方案设计素材（每日推送至飞书）
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                compareMode
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'border border-gray-200 bg-white text-gray-700 hover:border-primary-300'
              }`}
            >
              <GitCompare className="h-4 w-4" />
              方案对比
              {compareIds.length > 0 && (
                <span className={`rounded-full px-1.5 text-xs ${compareMode ? 'bg-white/20' : 'bg-primary-100 text-primary-700'}`}>
                  {compareIds.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                showFilters ? 'bg-primary-50 text-primary-700' : 'border border-gray-200 bg-white text-gray-700 hover:border-primary-300'
              }`}
            >
              <Filter className="h-4 w-4" />
              筛选
            </button>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="relative mb-4 max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索案例名称、建筑师、地点、标签..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {/* 筛选面板 */}
        {showFilters && (
          <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4">
            <div className="space-y-3">
              {/* 建筑类型 */}
              <div className="flex items-start gap-3">
                <span className="mt-1 w-16 flex-shrink-0 text-xs font-medium text-gray-500">建筑类型</span>
                <div className="flex flex-wrap gap-1.5">
                  {BUILDING_TYPES.map((t) => (
                    <FilterButton key={t} active={filterType === t} onClick={() => setFilterType(t)}>
                      {t}
                    </FilterButton>
                  ))}
                </div>
              </div>
              {/* 地域 */}
              <div className="flex items-start gap-3">
                <span className="mt-1 w-16 flex-shrink-0 text-xs font-medium text-gray-500">地域</span>
                <div className="flex flex-wrap gap-1.5">
                  {REGIONS.map((r) => (
                    <FilterButton key={r} active={filterRegion === r} onClick={() => setFilterRegion(r)}>
                      {r}
                    </FilterButton>
                  ))}
                </div>
              </div>
              {/* 气候分区 */}
              <div className="flex items-start gap-3">
                <span className="mt-1 w-16 flex-shrink-0 text-xs font-medium text-gray-500">气候分区</span>
                <div className="flex flex-wrap gap-1.5">
                  {CLIMATE_ZONES.map((c) => (
                    <FilterButton key={c} active={filterClimate === c} onClick={() => setFilterClimate(c)}>
                      {c}
                    </FilterButton>
                  ))}
                </div>
              </div>
              {/* 结构形式 */}
              <div className="flex items-start gap-3">
                <span className="mt-1 w-16 flex-shrink-0 text-xs font-medium text-gray-500">结构形式</span>
                <div className="flex flex-wrap gap-1.5">
                  {STRUCTURE_TYPES.map((s) => (
                    <FilterButton key={s} active={filterStructure === s} onClick={() => setFilterStructure(s)}>
                      {s}
                    </FilterButton>
                  ))}
                </div>
              </div>
              {/* 层数 + 容积率 */}
              <div className="flex items-start gap-6">
                <div className="flex items-start gap-3">
                  <span className="mt-1 w-16 flex-shrink-0 text-xs font-medium text-gray-500">层数</span>
                  <div className="flex flex-wrap gap-1.5">
                    {FLOOR_RANGES.map((f, i) => (
                      <FilterButton key={f.label} active={filterFloorRange === i} onClick={() => setFilterFloorRange(i)}>
                        {f.label}
                      </FilterButton>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 w-16 flex-shrink-0 text-xs font-medium text-gray-500">容积率</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PLOT_RATIO_RANGES.map((p, i) => (
                      <FilterButton key={p.label} active={filterPlotRatio === i} onClick={() => setFilterPlotRatio(i)}>
                        {p.label}
                      </FilterButton>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-400">共 {filteredCases.length} 个案例</span>
              <button onClick={resetFilters} className="text-xs text-primary-600 hover:underline">
                重置筛选
              </button>
            </div>
          </div>
        )}

        {/* 对比模式浮动栏 */}
        {compareMode && compareIds.length > 0 && (
          <div className="sticky top-4 z-20 mb-4 flex items-center justify-between rounded-xl border border-primary-200 bg-primary-50/90 p-3 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <GitCompare className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-800">
                已选择 {compareIds.length}/3 个案例进行对比
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompareIds([])}
                className="rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-white/50"
              >
                清空
              </button>
              <button
                onClick={() => setSelectedCase(null)}
                className="rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
              >
                开始对比
              </button>
            </div>
          </div>
        )}

        {/* 对比视图 */}
        {compareMode && compareCases.length >= 2 && !selectedCase ? (
          <CaseCompareView cases={compareCases} onClose={() => setCompareMode(false)} />
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* 案例列表 */}
            <div className="col-span-1 space-y-3">
              {filteredCases.map((c) => (
                <div
                  key={c.id}
                  className={`relative rounded-xl border p-4 transition-all ${
                    selectedCase?.id === c.id
                      ? 'border-primary-300 bg-primary-50/50 shadow-sm'
                      : 'border-gray-100 bg-white hover:border-primary-200'
                  }`}
                >
                  {compareMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(c.id);
                      }}
                      className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                        compareIds.includes(c.id)
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-gray-300 bg-white hover:border-primary-400'
                      }`}
                    >
                      {compareIds.includes(c.id) && <Check className="h-3 w-3" />}
                    </button>
                  )}
                  <button onClick={() => setSelectedCase(c)} className="w-full text-left">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                        <Building2 className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate pr-6 text-sm font-semibold text-gray-900">{c.name}</div>
                        <div className="mt-0.5 truncate text-xs text-gray-500">{c.architect}</div>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                          <span>{c.location}</span>
                          <span>·</span>
                          <span>{c.year}</span>
                        </div>
                        {/* 参数化标签 */}
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {c.region && (
                            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600">{c.region}</span>
                          )}
                          {c.structureType && (
                            <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] text-green-600">{c.structureType}</span>
                          )}
                          {c.floorCount && (
                            <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] text-purple-600">{c.floorCount}层</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
              {filteredCases.length === 0 && (
                <div className="rounded-xl border border-gray-100 bg-white p-8 text-center">
                  <p className="text-sm text-gray-400">没有符合筛选条件的案例</p>
                  <button onClick={resetFilters} className="mt-2 text-xs text-primary-600 hover:underline">
                    重置筛选
                  </button>
                </div>
              )}
            </div>

            {/* 案例详情 */}
            <div className="col-span-2">
              {selectedCase ? (
                <CaseDetailView caseData={selectedCase} onBack={() => setSelectedCase(null)} />
              ) : (
                <div className="flex h-96 items-center justify-center rounded-xl border border-gray-100 bg-white">
                  <div className="text-center">
                    <Building2 className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-sm text-gray-400">
                      {compareMode ? '选择案例加入对比，或点击查看详情' : '选择左侧案例查看详情'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  );
}

// 案例详情视图组件
function CaseDetailView({ caseData, onBack }: { caseData: ArchCase; onBack: () => void }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{caseData.name}</h2>
        <button onClick={onBack} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 基本信息 */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Building2 className="h-4 w-4" />
          {caseData.architect}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {caseData.location}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {caseData.year}年
        </span>
        {caseData.area && caseData.area > 0 && (
          <span className="flex items-center gap-1">
            <Ruler className="h-4 w-4" />
            {caseData.area.toLocaleString()}㎡
          </span>
        )}
        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
          {caseData.buildingType}
        </span>
      </div>

      {/* 参数化信息 */}
      <div className="mt-4 grid grid-cols-4 gap-3 rounded-lg bg-gray-50 p-3">
        <ParamItem icon={<MapPin className="h-3.5 w-3.5" />} label="地域" value={caseData.region} />
        <ParamItem icon={<Mountain className="h-3.5 w-3.5" />} label="气候" value={caseData.climateZone} />
        <ParamItem icon={<Layers className="h-3.5 w-3.5" />} label="层数" value={caseData.floorCount ? `${caseData.floorCount}层` : undefined} />
        <ParamItem icon={<Home className="h-3.5 w-3.5" />} label="结构" value={caseData.structureType} />
        {caseData.buildingHeight && <ParamItem icon={<Ruler className="h-3.5 w-3.5" />} label="高度" value={`${caseData.buildingHeight}m`} />}
        {caseData.plotRatio && <ParamItem icon={<Layers className="h-3.5 w-3.5" />} label="容积率" value={caseData.plotRatio.toString()} />}
        {caseData.siteArea && <ParamItem icon={<MapPin className="h-3.5 w-3.5" />} label="用地" value={`${caseData.siteArea.toLocaleString()}㎡`} />}
        {caseData.regionStyle && <ParamItem icon={<Tag className="h-3.5 w-3.5" />} label="风格" value={caseData.regionStyle} />}
      </div>

      {/* 标签 */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {caseData.tags.map((tag, i) => (
          <span key={i} className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
            <Tag className="h-3 w-3" />
            {tag}
          </span>
        ))}
      </div>

      {/* 项目描述 */}
      <div className="mt-6">
        <h3 className="mb-2 text-sm font-semibold text-gray-900">项目描述</h3>
        <p className="text-sm leading-relaxed text-gray-700">{caseData.description}</p>
      </div>

      {/* 图纸分析 */}
      {caseData.images && caseData.images.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
            图纸分析
            <span className="text-xs font-normal text-gray-400">（点击图片可放大缩放查看）</span>
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {caseData.images.map((img, i) => (
              <div key={i}>
                <div className="mb-1.5 flex items-center gap-2 px-1">
                  <span className="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700">
                    {img.type === 'site' ? '总平' : img.type === 'plan' ? '平面' : img.type === 'elevation' ? '立面' : img.type === 'section' ? '剖面' : img.type === 'analysis' ? '分析' : img.type === 'axonometric' ? '轴测' : '图纸'}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{img.title}</span>
                </div>
                <ImageViewer src={img.url} alt={img.title} />
                {img.description && <p className="mt-1.5 px-1 text-xs leading-relaxed text-gray-500">{img.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 图纸详细解读 */}
      {caseData.drawingAnalysis && caseData.drawingAnalysis.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Target className="h-4 w-4 text-primary-600" />
            图纸详细解读
          </h3>
          <div className="space-y-5">
            {caseData.drawingAnalysis.map((da, idx) => (
              <div key={idx} className="overflow-hidden rounded-lg border border-gray-200">
                <div className="border-b border-gray-100 bg-gray-50 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700">
                      {da.type === 'site' ? '总平' : da.type === 'plan' ? '平面' : da.type === 'elevation' ? '立面' : da.type === 'section' ? '剖面' : da.type === 'axonometric' ? '轴测' : '分析'}
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
                          <span key={i} className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
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

      {/* 设计亮点 */}
      <div className="mt-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          设计亮点
        </h3>
        <ul className="space-y-2">
          {caseData.designHighlights.map((h, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-gray-700">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-semibold text-amber-700">
                {i + 1}
              </span>
              {h}
            </li>
          ))}
        </ul>
      </div>

      {/* 一注考点关联 */}
      <div className="mt-6 rounded-xl border border-primary-100 bg-primary-50/50 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary-800">
          <Target className="h-4 w-4" />
          一注考点关联
        </h3>
        <ul className="space-y-1.5">
          {caseData.examRelevance.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-primary-700">
              <span className="text-primary-400">→</span>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// 参数项组件
function ParamItem({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-400">{icon}</span>
      <span className="text-[11px] text-gray-500">{label}:</span>
      <span className="text-[11px] font-medium text-gray-700">{value}</span>
    </div>
  );
}

// 方案对比视图组件
function CaseCompareView({ cases, onClose }: { cases: ArchCase[]; onClose: () => void }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <GitCompare className="h-5 w-5 text-primary-600" />
          方案对比分析
        </h2>
        <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 对比表格 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-32 p-3 text-left text-xs font-medium text-gray-500">对比项</th>
              {cases.map((c) => (
                <th key={c.id} className="p-3 text-left">
                  <div className="text-sm font-bold text-gray-900">{c.name}</div>
                  <div className="mt-0.5 text-xs text-gray-500">{c.architect}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <CompareRow label="地点" values={cases.map((c) => c.location)} />
            <CompareRow label="建成年份" values={cases.map((c) => `${c.year}年`)} />
            <CompareRow label="建筑类型" values={cases.map((c) => c.buildingType)} />
            <CompareRow label="建筑面积" values={cases.map((c) => (c.area ? `${c.area.toLocaleString()}㎡` : '-'))} />
            <CompareRow label="地域" values={cases.map((c) => c.region || '-')} />
            <CompareRow label="气候分区" values={cases.map((c) => c.climateZone || '-')} />
            <CompareRow label="层数" values={cases.map((c) => (c.floorCount ? `${c.floorCount}层` : '-'))} />
            <CompareRow label="结构形式" values={cases.map((c) => c.structureType || '-')} />
            <CompareRow label="建筑高度" values={cases.map((c) => (c.buildingHeight ? `${c.buildingHeight}m` : '-'))} />
            <CompareRow label="容积率" values={cases.map((c) => (c.plotRatio ? c.plotRatio.toString() : '-'))} />
            <CompareRow label="用地面积" values={cases.map((c) => (c.siteArea ? `${c.siteArea.toLocaleString()}㎡` : '-'))} />
            <CompareRow label="地域风格" values={cases.map((c) => c.regionStyle || '-')} />
          </tbody>
        </table>
      </div>

      {/* 设计亮点对比 */}
      <div className="mt-8">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          设计亮点对比
        </h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cases.length}, 1fr)` }}>
          {cases.map((c) => (
            <div key={c.id} className="rounded-lg border border-gray-200 p-4">
              <h4 className="mb-2 text-sm font-semibold text-gray-900">{c.name}</h4>
              <ul className="space-y-1.5">
                {c.designHighlights.slice(0, 4).map((h, i) => (
                  <li key={i} className="flex gap-1.5 text-xs leading-relaxed text-gray-600">
                    <span className="text-amber-500">•</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 考点关联对比 */}
      <div className="mt-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Target className="h-4 w-4 text-primary-600" />
          一注考点关联对比
        </h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cases.length}, 1fr)` }}>
          {cases.map((c) => (
            <div key={c.id} className="rounded-lg border border-primary-100 bg-primary-50/30 p-4">
              <h4 className="mb-2 text-sm font-semibold text-primary-800">{c.name}</h4>
              <ul className="space-y-1.5">
                {c.examRelevance.slice(0, 4).map((r, i) => (
                  <li key={i} className="flex gap-1.5 text-xs leading-relaxed text-primary-700">
                    <span className="text-primary-400">→</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 对比总结 */}
      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/50 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-800">
          <Lightbulb className="h-4 w-4" />
          对比总结与学习建议
        </h3>
        <div className="space-y-2 text-sm leading-relaxed text-amber-800">
          <p>• 以上 {cases.length} 个案例在{cases.map((c) => c.buildingType).filter((v, i, a) => a.indexOf(v) === i).join('、')}类型下各有特色，可从空间组织、材料表达、结构逻辑、地域回应等维度对比学习。</p>
          <p>• 建议重点关注各案例在相似功能下的不同解决策略，思考哪种策略更适合一注大设计的考试场景。</p>
          <p>• 对比时注意：考试方案优先考虑功能分区合理、流线清晰、规范合规，艺术表达是加分项而非必需项。</p>
        </div>
      </div>
    </div>
  );
}

// 对比行组件
function CompareRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-3 text-xs font-medium text-gray-500">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="p-3 text-sm text-gray-700">
          {v}
        </td>
      ))}
    </tr>
  );
}
