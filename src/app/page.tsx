'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  PencilRuler,
  Trophy,
  Clock,
  TrendingUp,
  ArrowRight,
  Building2,
  Target,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import AppLayout from '@/components/layout/AppLayout';
import { getRecords, calculateStats } from '@/lib/storage';
import examsData from '@/../data/exams.json';
import type { Exam, LearningStats } from '@/types';
import { formatDuration } from '@/lib/utils';

export default function HomePage() {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [recentExams, setRecentExams] = useState<Exam[]>([]);

  useEffect(() => {
    const exams = examsData as Exam[];
    setStats(calculateStats(exams.length));
    // 取最近5年真题
    setRecentExams(exams.slice(-5).reverse());
  }, []);

  return (
    <AppLayout>
      <Sidebar />
      <main className="ml-56 min-h-screen p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">备考仪表盘</h1>
          <p className="mt-1 text-sm text-gray-500">
            一级注册建筑师 · 建筑方案设计（作图题）训练
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">{stats?.totalExams || 0}</div>
              <div className="text-xs text-gray-500">题库总数</div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Trophy className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">{stats?.completedCount || 0}</div>
              <div className="text-xs text-gray-500">已完成训练</div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">
                {stats?.averageScore || 0}
                <span className="text-sm font-normal text-gray-400">分</span>
              </div>
              <div className="text-xs text-gray-500">平均得分</div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">
                {formatDuration(stats?.totalStudyMinutes || 0)}
              </div>
              <div className="text-xs text-gray-500">总学习时长</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Recent Exams */}
          <div className="col-span-2 rounded-xl border border-gray-100 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">最近真题</h2>
              <Link
                href="/quiz"
                className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
              >
                查看全部 <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentExams.map((exam) => (
                <Link
                  key={exam.id}
                  href={`/quiz/${exam.id}`}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:border-primary-200 hover:bg-primary-50/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <Building2 className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {exam.year}年 · {exam.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {exam.buildingType} · {exam.corePoints.slice(0, 2).join('、')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
                      难度 {exam.difficulty}/5
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <h2 className="mb-4 text-base font-semibold text-gray-900">快速开始</h2>
              <div className="space-y-3">
                <Link
                  href="/quiz"
                  className="flex items-center gap-3 rounded-lg bg-primary-600 p-3 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                  <PencilRuler className="h-4 w-4" />
                  开始新训练
                </Link>
                <Link
                  href="/records"
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Clock className="h-4 w-4" />
                  查看训练记录
                </Link>
                <Link
                  href="/cases"
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Building2 className="h-4 w-4" />
                  建筑案例库
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-primary-50 to-primary-100 p-6">
              <div className="flex items-center gap-2 text-primary-700">
                <Target className="h-5 w-5" />
                <h3 className="text-sm font-semibold">今日目标</h3>
              </div>
              <p className="mt-2 text-xs text-primary-600">
                完成1道真题训练，重点关注功能分区与流线组织。每天进步一点点，坚持就是胜利！
              </p>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
