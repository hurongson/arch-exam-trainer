'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Ruler,
  Layers,
  Target,
  CheckCircle2,
  PencilRuler,
  Clock,
  Star,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import AppLayout from '@/components/layout/AppLayout';
import examsData from '@/../data/exams.json';
import type { Exam } from '@/types';
import { createRecord } from '@/lib/storage';

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const exams = examsData as Exam[];
    const found = exams.find((e) => e.id === params.id);
    setExam(found || null);
  }, [params.id]);

  const handleStartTraining = () => {
    if (!exam) return;
    setStarting(true);
    const record = createRecord(exam.id, exam.title, exam.year);
    setTimeout(() => {
      router.push(`/train/${record.id}`);
    }, 500);
  };

  if (!exam) {
    return (
      <AppLayout>
        <Sidebar />
        <main className="ml-56 min-h-screen p-8">
          <div className="py-16 text-center">
            <p className="text-sm text-gray-500">题目不存在</p>
            <Link href="/quiz" className="mt-4 inline-block text-sm text-primary-600 hover:underline">
              返回题库
            </Link>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Sidebar />
      <main className="ml-56 min-h-screen p-8">
        {/* Back */}
        <Link
          href="/quiz"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          返回题库
        </Link>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Title Card */}
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50">
                    <Building2 className="h-7 w-7 text-primary-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      {exam.year}年 · {exam.title}
                    </h1>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <span className="rounded-full bg-primary-50 px-2.5 py-0.5 font-medium text-primary-700">
                        {exam.buildingType}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                        难度 {exam.difficulty}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Description */}
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
                <Target className="h-4 w-4 text-primary-600" />
                任务描述
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">{exam.description}</p>
            </div>

            {/* Site Conditions */}
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
                <MapPin className="h-4 w-4 text-primary-600" />
                用地条件
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">{exam.siteConditions}</p>
            </div>

            {/* Design Requirements */}
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
                <CheckCircle2 className="h-4 w-4 text-primary-600" />
                设计要求
              </h2>
              <ul className="space-y-2">
                {exam.designRequirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-[11px] font-semibold text-primary-700">
                      {i + 1}
                    </span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Area Table */}
            {exam.areaTable && exam.areaTable.length > 0 && (
              <div className="rounded-xl border border-gray-100 bg-white p-6">
                <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
                  <Layers className="h-4 w-4 text-primary-600" />
                  面积表
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-2 text-left font-semibold text-gray-900">功能分区</th>
                        <th className="pb-2 text-left font-semibold text-gray-900">包含房间</th>
                        <th className="pb-2 text-right font-semibold text-gray-900">面积</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exam.areaTable.map((item, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-2 font-medium text-gray-900">{item.zone}</td>
                          <td className="py-2 text-gray-600">{item.rooms}</td>
                          <td className="py-2 text-right font-medium text-primary-700">{item.area}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Exam Images */}
            {exam.images && exam.images.length > 0 && (
              <div className="rounded-xl border border-gray-100 bg-white p-6">
                <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
                  <MapPin className="h-4 w-4 text-primary-600" />
                  真题图纸
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {exam.images.map((img, i) => (
                    <div key={i} className="overflow-hidden rounded-lg border border-gray-200">
                      <div className="bg-gray-50 p-2">
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full rounded border border-gray-200 bg-white"
                          style={{ maxHeight: '500px', objectFit: 'contain' }}
                        />
                      </div>
                      <div className="border-t border-gray-100 bg-white px-4 py-2">
                        <p className="text-sm font-medium text-gray-900">{img.title}</p>
                        {img.description && (
                          <p className="mt-1 text-xs text-gray-500">{img.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Points */}
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
                <Star className="h-4 w-4 text-primary-600" />
                核心考点
              </h2>
              <div className="flex flex-wrap gap-2">
                {exam.corePoints.map((point, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">题目信息</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Ruler className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">用地尺寸</span>
                  <span className="ml-auto font-medium text-gray-900">
                    {exam.siteSize || '—'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Layers className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">总建筑面积</span>
                  <span className="ml-auto font-medium text-gray-900">
                    {exam.totalArea && exam.totalArea > 0 ? `${exam.totalArea}㎡` : '—'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">层数</span>
                  <span className="ml-auto font-medium text-gray-900">{exam.floors || '—'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">考试时长</span>
                  <span className="ml-auto font-medium text-gray-900">6小时</span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <button
                onClick={handleStartTraining}
                disabled={starting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
              >
                <PencilRuler className="h-4 w-4" />
                {starting ? '正在创建训练...' : '开始方案训练'}
              </button>
              <p className="mt-3 text-center text-xs text-gray-400">
                进入专业绘图画布，完成后可提交AI评图
              </p>
            </div>

            {/* Tips */}
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
              <h3 className="mb-2 text-sm font-semibold text-amber-800">训练建议</h3>
              <ul className="space-y-1.5 text-xs leading-relaxed text-amber-700">
                <li>• 先通读任务书，明确功能分区和流线要求</li>
                <li>• 先做气泡图和功能关系图，再落平面</li>
                <li>• 注意柱网规整，优先8m左右柱距</li>
                <li>• 完成后检查面积、疏散、规范符合性</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
