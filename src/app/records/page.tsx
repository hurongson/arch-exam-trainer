'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  History,
  Trash2,
  Eye,
  Clock,
  Award,
  Building2,
  ArrowRight,
  PlayCircle,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import AppLayout from '@/components/layout/AppLayout';
import { getRecords, deleteRecord } from '@/lib/storage';
import type { TrainingRecord } from '@/types';
import { formatDate, formatDuration } from '@/lib/utils';

export default function RecordsPage() {
  const [records, setRecords] = useState<TrainingRecord[]>([]);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条训练记录吗？')) {
      deleteRecord(id);
      setRecords(getRecords());
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">已完成</span>;
      case 'in_progress':
        return <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">进行中</span>;
      default:
        return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">已放弃</span>;
    }
  };

  return (
    <AppLayout>
      <Sidebar />
      <main className="ml-56 min-h-screen p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">训练记录</h1>
          <p className="mt-1 text-sm text-gray-500">
            共 {records.length} 条训练记录
          </p>
        </div>

        {records.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white py-20 text-center">
            <History className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-sm text-gray-500">还没有训练记录</p>
            <Link
              href="/quiz"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <PlayCircle className="h-4 w-4" />
              开始第一次训练
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 transition-colors hover:border-primary-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                    <Building2 className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {record.examYear}年 · {record.examTitle}
                      </span>
                      {getStatusBadge(record.status)}
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(record.startedAt)}
                      </span>
                      {record.completedAt && record.startedAt && (
                        <span>
                          用时 {formatDuration(
                            Math.round(
                              (new Date(record.completedAt).getTime() -
                                new Date(record.startedAt).getTime()) /
                                60000
                            )
                          )}
                        </span>
                      )}
                      {record.evaluation && (
                        <span className="flex items-center gap-1 font-medium text-primary-600">
                          <Award className="h-3 w-3" />
                          得分 {record.evaluation.totalScore}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/train/${record.id}`}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    {record.status === 'in_progress' ? (
                      <>
                        <PlayCircle className="h-3.5 w-3.5" />
                        继续训练
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        查看详情
                      </>
                    )}
                  </Link>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AppLayout>
  );
}
