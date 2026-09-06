'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Send,
  Clock,
  Download,
  Loader2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  AlertCircle,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import AppLayout from '@/components/layout/AppLayout';
import { getRecord, saveRecord, saveEvaluation } from '@/lib/storage';
import examsData from '@/../data/exams.json';
import type { Exam, TrainingRecord, EvaluationResult } from '@/types';
import { formatDuration, formatDate, generateId } from '@/lib/utils';

// 动态导入专业建筑画布（客户端 only）
import dynamic from 'next/dynamic';

const ArchCanvas = dynamic(() => import('@/components/canvas/ArchCanvas').then(m => m.ArchCanvas), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
    </div>
  ),
});

type TabType = 'canvas' | 'result';

export default function TrainPage() {
  const params = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<TrainingRecord | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('canvas');
  const [elapsed, setElapsed] = useState(0);
  const [saving, setSaving] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evalError, setEvalError] = useState('');
  const editorRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 加载记录和题目
  useEffect(() => {
    const rec = getRecord(params.recordId as string);
    if (rec) {
      setRecord(rec);
      const exams = examsData as Exam[];
      const found = exams.find((e) => e.id === rec.examId);
      setExam(found || null);

      // 计算已用时间
      if (rec.startedAt) {
        const start = new Date(rec.startedAt).getTime();
        const now = Date.now();
        setElapsed(Math.floor((now - start) / 1000));
      }
    }
  }, [params.recordId]);

  // 计时器
  useEffect(() => {
    if (record?.status === 'in_progress') {
      timerRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [record?.status]);

  // 自动保存（每30秒）
  useEffect(() => {
    const interval = setInterval(() => {
      handleSave(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 保存方案
  const handleSave = useCallback(
    async (auto = false) => {
      if (!record || !editorRef.current) return;
      setSaving(true);
      try {
        const snapshot = await editorRef.current.getSnapshot();
        const updated: TrainingRecord = {
          ...record,
          schemeData: snapshot,
        };
        saveRecord(updated);
        setRecord(updated);
      } catch (e) {
        console.error('保存失败', e);
      } finally {
        setSaving(false);
      }
    },
    [record]
  );

  // 导出方案 JSON
  const handleExport = async () => {
    if (!editorRef.current) return;
    const snapshot = await editorRef.current.getSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exam?.title || '方案'}_${formatDate(new Date(), 'yyyyMMdd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 提交评图
  const handleEvaluate = async () => {
    if (!record || !exam || !editorRef.current) return;
    setEvaluating(true);
    setEvalError('');

    try {
      // 先保存
      await handleSave();

      // 获取方案快照并解析为文本描述
      const snapshot = await editorRef.current.getSnapshot();
      const schemeDescription = parseSchemeToText(snapshot, exam);

      // 调用 API
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeDescription,
          examInfo: {
            title: exam.title,
            year: exam.year,
            designRequirements: exam.designRequirements,
            corePoints: exam.corePoints,
            buildingType: exam.buildingType,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '评图失败');
      }

      // 解析评图结果
      const evalResult: EvaluationResult = {
        id: generateId('eval'),
        recordId: record.id,
        ...data.result,
        evaluatedAt: new Date().toISOString(),
        model: 'deepseek-chat',
      };

      saveEvaluation(record.id, evalResult);
      setRecord({ ...record, evaluation: evalResult, status: 'completed' });
      setActiveTab('result');
    } catch (e: any) {
      setEvalError(e.message || '评图过程中出现错误，请重试');
    } finally {
      setEvaluating(false);
    }
  };

  if (!record || !exam) {
    return (
      <AppLayout>
        <Sidebar />
        <main className="ml-56 min-h-screen p-8">
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Sidebar />
      <main className="ml-56 flex h-screen flex-col">
        {/* Top Bar */}
        <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/quiz/${exam.id}`}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              返回题目
            </Link>
            <div className="h-4 w-px bg-gray-200" />
            <div>
              <span className="text-sm font-semibold text-gray-900">
                {exam.year}年 · {exam.title}
              </span>
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                {exam.buildingType}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-mono text-sm font-semibold text-gray-900">
                {formatTime(elapsed)}
              </span>
            </div>

            {/* Tabs */}
            <div className="flex rounded-lg bg-gray-100 p-0.5">
              <button
                onClick={() => setActiveTab('canvas')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === 'canvas' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                方案画布
              </button>
              <button
                onClick={() => setActiveTab('result')}
                disabled={!record.evaluation}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === 'result'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : record.evaluation
                    ? 'text-gray-500'
                    : 'cursor-not-allowed text-gray-300'
                }`}
              >
                评图结果
                {record.evaluation && (
                  <span className="ml-1 rounded-full bg-green-100 px-1.5 text-[10px] text-green-700">
                    {record.evaluation.totalScore}
                  </span>
                )}
              </button>
            </div>

            {/* Actions */}
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? '保存中' : '保存'}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Download className="h-3.5 w-3.5" />
              导出
            </button>
            <button
              onClick={handleEvaluate}
              disabled={evaluating}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {evaluating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  AI评图中...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  提交AI评图
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {evalError && (
          <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-6 py-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {evalError}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'canvas' ? (
            <div className="flex h-full">
              {/* Left Panel - Task Info */}
              <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  任务书
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 text-[11px] font-medium text-gray-400">任务描述</div>
                    <p className="text-xs leading-relaxed text-gray-700">{exam.description}</p>
                  </div>
                  <div>
                    <div className="mb-1 text-[11px] font-medium text-gray-400">用地条件</div>
                    <p className="text-xs leading-relaxed text-gray-700">{exam.siteConditions}</p>
                  </div>
                  <div>
                    <div className="mb-1 text-[11px] font-medium text-gray-400">设计要求</div>
                    <ul className="space-y-1">
                      {exam.designRequirements.map((req, i) => (
                        <li key={i} className="flex gap-1.5 text-xs leading-relaxed text-gray-700">
                          <span className="text-primary-500">{i + 1}.</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-1 text-[11px] font-medium text-gray-400">核心考点</div>
                    <div className="flex flex-wrap gap-1">
                      {exam.corePoints.map((p, i) => (
                        <span
                          key={i}
                          className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] text-orange-700"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Canvas - 专业建筑画布 */}
              <div className="flex-1 bg-white">
                <ArchCanvas
                  ref={editorRef}
                  initialData={record.schemeData}
                  buildingType={exam.buildingType}
                />
              </div>
            </div>
          ) : (
            <EvaluationResultView result={record.evaluation!} exam={exam} />
          )}
        </div>
      </main>
    </AppLayout>
  );
}

/**
 * 解析 tldraw 快照为方案文本描述
 * 用于 DeepSeek 文本模型评图
 */
function parseSchemeToText(snapshot: any, exam: Exam): string {
  if (!snapshot || !snapshot.store) return '方案数据为空';

  const shapes = snapshot.store?.document?.documents?.[0]?.root?.children || [];
  const shapeCount = Array.isArray(shapes) ? shapes.length : Object.keys(shapes || {}).length;

  let description = `【方案基本信息】
题目：${exam.year}年 ${exam.title}
建筑类型：${exam.buildingType}
画布元素数量：约 ${shapeCount} 个

【方案分析】
由于本方案基于矢量绘图数据，以下为从画布元素推断的方案特征：
1. 方案包含 ${shapeCount} 个绘图元素，涵盖墙体、门窗、标注、文字等
2. 考生已完成方案设计的主要绘图工作
3. 需结合评分标准对功能分区、流线组织、空间布局等进行评估

【评图提示】
请基于题目要求和评分标准，对方案进行专业评估。重点关注：
- 功能分区是否合理
- 流线组织是否清晰无交叉
- 空间布局是否满足设计要求
- 规范符合性（防火、疏散、无障碍等）
- 图面表达完整性`;

  return description;
}

/**
 * 评图结果视图
 */
function EvaluationResultView({
  result,
  exam,
}: {
  result: EvaluationResult;
  exam: Exam;
}) {
  const scoreColor =
    result.totalScore >= 70
      ? 'text-green-600'
      : result.totalScore >= 50
      ? 'text-orange-600'
      : 'text-red-600';

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Score Header */}
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-8 text-center">
          <div className="mb-2 text-sm text-gray-500">
            {exam.year}年 · {exam.title} · AI评图结果
          </div>
          <div className={`text-6xl font-bold ${scoreColor}`}>
            {result.totalScore}
            <span className="text-2xl text-gray-400">/{result.maxScore || 100}</span>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Award className="h-4 w-4" />
            {result.totalScore >= 70 ? '方案良好，继续保持' : result.totalScore >= 50 ? '方案及格，仍有提升空间' : '方案需重点改进'}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            评图时间：{formatDate(result.evaluatedAt)} · 模型：{result.model}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
            <TrendingUp className="h-4 w-4 text-primary-600" />
            总体评价
          </h3>
          <p className="text-sm leading-relaxed text-gray-700">{result.summary}</p>
        </div>

        {/* Score Items */}
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900">分项得分</h3>
          <div className="space-y-4">
            {result.scoreItems.map((item, i) => (
              <div key={i}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{item.category}</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {item.score}/{item.maxScore}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${
                      item.score / item.maxScore >= 0.7
                        ? 'bg-green-500'
                        : item.score / item.maxScore >= 0.5
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                  />
                </div>
                {item.deductions.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {item.deductions.map((d, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-xs text-red-600">
                        <XCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="mb-6 grid grid-cols-2 gap-6">
          <div className="rounded-xl border border-green-100 bg-green-50 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              方案优点
            </h3>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-green-700">
                  <span className="text-green-500">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-red-100 bg-red-50 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-red-800">
              <XCircle className="h-4 w-4" />
              存在不足
            </h3>
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="flex gap-2 text-sm text-red-700">
                  <span className="text-red-500">✗</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggestions */}
        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
            <TrendingUp className="h-4 w-4 text-primary-600" />
            改进建议
          </h3>
          <ol className="space-y-2">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-gray-700">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-[11px] font-semibold text-primary-700">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
