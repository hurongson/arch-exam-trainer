'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Building2, ArrowRight, Star } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import AppLayout from '@/components/layout/AppLayout';
import examsData from '@/../data/exams.json';
import type { Exam, BuildingType } from '@/types';

const buildingTypes: (BuildingType | '全部')[] = [
  '全部',
  '文体',
  '服务',
  '医养',
  '交通',
  '商业',
  '居住',
  '工业科研',
];

export default function QuizPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<BuildingType | '全部'>('全部');
  const [difficultyFilter, setDifficultyFilter] = useState<number | '全部'>('全部');

  const exams = examsData as Exam[];

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchSearch =
        exam.title.includes(search) ||
        exam.year.includes(search) ||
        exam.corePoints.some((p) => p.includes(search));
      const matchType = typeFilter === '全部' || exam.buildingType === typeFilter;
      const matchDifficulty =
        difficultyFilter === '全部' || exam.difficulty === difficultyFilter;
      return matchSearch && matchType && matchDifficulty;
    });
  }, [exams, search, typeFilter, difficultyFilter]);

  return (
    <AppLayout>
      <Sidebar />
      <main className="ml-56 min-h-screen p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">真题题库</h1>
          <p className="mt-1 text-sm text-gray-500">
            共 {exams.length} 道历年真题（2003-2025，2015/2016停考，2022年两次）
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索题目名称、年份、考点..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as BuildingType | '全部')}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-400"
            >
              {buildingTypes.map((type) => (
                <option key={type} value={type}>
                  {type === '全部' ? '全部类型' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) =>
              setDifficultyFilter(e.target.value === '全部' ? '全部' : Number(e.target.value))
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-400"
          >
            <option value="全部">全部难度</option>
            {[1, 2, 3, 4, 5].map((d) => (
              <option key={d} value={d}>
                难度 {d}/5
              </option>
            ))}
          </select>
        </div>

        {/* Exam Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredExams.map((exam) => (
            <Link
              key={exam.id}
              href={`/quiz/${exam.id}`}
              className="group rounded-xl border border-gray-100 bg-white p-5 transition-all hover:border-primary-200 hover:shadow-lg hover:shadow-primary-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                    <Building2 className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-gray-900 group-hover:text-primary-700">
                      {exam.year}年 · {exam.title}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {exam.buildingType}
                      {exam.totalArea && exam.totalArea > 0 && ` · 约${exam.totalArea}㎡`}
                      {exam.floors && ` · ${exam.floors}`}
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 transition-colors group-hover:text-primary-500" />
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {exam.corePoints.slice(0, 3).map((point, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600"
                  >
                    {point}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= exam.difficulty
                          ? 'fill-orange-400 text-orange-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-[11px] text-gray-400">难度 {exam.difficulty}/5</span>
                </div>
                <span className="text-xs font-medium text-primary-600 group-hover:underline">
                  开始训练 →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredExams.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white py-16 text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-sm text-gray-500">没有找到匹配的真题</p>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
