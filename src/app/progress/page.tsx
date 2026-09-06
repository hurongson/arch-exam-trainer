'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  Target,
  BookOpen,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import AppLayout from '@/components/layout/AppLayout';
import { calculateStats } from '@/lib/storage';
import examsData from '@/../data/exams.json';
import type { LearningStats, Exam } from '@/types';
import { formatDuration } from '@/lib/utils';

export default function ProgressPage() {
  const [stats, setStats] = useState<LearningStats | null>(null);

  useEffect(() => {
    const exams = examsData as Exam[];
    setStats(calculateStats(exams.length));
  }, []);

  const maxScore = 100;

  return (
    <AppLayout>
      <Sidebar />
      <main className="ml-56 min-h-screen p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">学习进度</h1>
          <p className="mt-1 text-sm text-gray-500">追踪你的训练数据和得分趋势</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div className="mt-3 text-2xl font-bold text-gray-900">
              {stats?.completedCount || 0}
              <span className="text-sm font-normal text-gray-400">/{stats?.totalExams || 0}</span>
            </div>
            <div className="text-xs text-gray-500">已完成真题</div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{
                  width: `${stats && stats.totalExams > 0 ? (stats.completedCount / stats.totalExams) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div className="mt-3 text-2xl font-bold text-gray-900">
              {stats?.averageScore || 0}
              <span className="text-sm font-normal text-gray-400">分</span>
            </div>
            <div className="text-xs text-gray-500">平均得分</div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="mt-3 text-2xl font-bold text-gray-900">
              {formatDuration(stats?.totalStudyMinutes || 0)}
            </div>
            <div className="text-xs text-gray-500">总学习时长</div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div className="mt-3 text-2xl font-bold text-gray-900">
              {stats?.recentScores.length || 0}
            </div>
            <div className="text-xs text-gray-500">近期训练次数</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Score Trend */}
          <div className="col-span-2 rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
              <TrendingUp className="h-4 w-4 text-primary-600" />
              得分趋势
            </h2>
            {stats && stats.recentScores.length > 0 ? (
              <div className="space-y-3">
                {stats.recentScores.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-24 flex-shrink-0 text-xs text-gray-500">{item.date}</span>
                    <div className="flex-1">
                      <div className="h-6 overflow-hidden rounded-md bg-gray-100">
                        <div
                          className={`flex h-full items-center justify-end rounded-md pr-2 text-[10px] font-semibold text-white ${
                            item.score >= 70
                              ? 'bg-green-500'
                              : item.score >= 50
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.max(item.score, 8)}%` }}
                        >
                          {item.score}分
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-gray-400">
                暂无得分数据，完成训练后查看趋势
              </div>
            )}
          </div>

          {/* By Type */}
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
              <BarChart3 className="h-4 w-4 text-primary-600" />
              按类型统计
            </h2>
            {stats && stats.byTypeStats.length > 0 ? (
              <div className="space-y-4">
                {stats.byTypeStats.map((item, i) => (
                  <div key={i}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700">{item.type}</span>
                      <span className="text-gray-500">
                        {item.count}题 · 平均{item.avgScore}分
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{ width: `${item.avgScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-gray-400">
                暂无分类统计数据
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-6">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800">
            <Target className="h-4 w-4" />
            备考建议
          </h3>
          <ul className="space-y-1.5 text-xs leading-relaxed text-amber-700">
            <li>• 优先攻克高频类型：文体类（图书馆/博物馆/电影院）占比最高，是备考重点</li>
            <li>• 流线类题目（交通/医养/法院）要特别注意多流线分离，这是主要扣分点</li>
            <li>• 每次训练后认真阅读AI评图的改进建议，针对性薄弱环节进行专项训练</li>
            <li>• 建议每周完成2-3道完整真题训练，保持手感和设计思维</li>
          </ul>
        </div>
      </main>
    </AppLayout>
  );
}
