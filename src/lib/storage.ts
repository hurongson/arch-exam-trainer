/**
 * 本地存储工具
 * 单用户模式下使用 localStorage 存储数据
 * 后续可扩展为 Supabase 云端存储
 */

import type { TrainingRecord, EvaluationResult, UserSettings, LearningStats } from '@/types';
import { safeJsonParse, generateId } from './utils';

const STORAGE_KEYS = {
  AUTH: 'arch_trainer_auth',
  RECORDS: 'arch_trainer_records',
  SETTINGS: 'arch_trainer_settings',
  CASES: 'arch_trainer_cases',
};

// ============ 认证 ============

/** 检查是否已登录 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
}

/** 登录（验证密码） */
export function login(password: string): boolean {
  const appPassword = process.env.NEXT_PUBLIC_APP_PASSWORD || 'admin123';
  if (password === appPassword) {
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    return true;
  }
  return false;
}

/** 登出 */
export function logout() {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

// ============ 训练记录 ============

/** 获取所有训练记录 */
export function getRecords(): TrainingRecord[] {
  if (typeof window === 'undefined') return [];
  return safeJsonParse<TrainingRecord[]>(localStorage.getItem(STORAGE_KEYS.RECORDS), []);
}

/** 保存训练记录 */
export function saveRecord(record: TrainingRecord): void {
  const records = getRecords();
  const index = records.findIndex((r) => r.id === record.id);
  if (index >= 0) {
    records[index] = record;
  } else {
    records.unshift(record);
  }
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
}

/** 创建新训练记录 */
export function createRecord(examId: string, examTitle: string, examYear: string): TrainingRecord {
  const record: TrainingRecord = {
    id: generateId('record'),
    examId,
    examTitle,
    examYear,
    startedAt: new Date().toISOString(),
    status: 'in_progress',
  };
  saveRecord(record);
  return record;
}

/** 获取单条记录 */
export function getRecord(id: string): TrainingRecord | undefined {
  return getRecords().find((r) => r.id === id);
}

/** 删除记录 */
export function deleteRecord(id: string): void {
  const records = getRecords().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
}

// ============ 评图结果 ============

/** 保存评图结果 */
export function saveEvaluation(recordId: string, evaluation: EvaluationResult): void {
  const records = getRecords();
  const record = records.find((r) => r.id === recordId);
  if (record) {
    record.evaluation = evaluation;
    record.status = 'completed';
    record.completedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }
}

// ============ 用户设置 ============

/** 获取用户设置 */
export function getSettings(): UserSettings {
  if (typeof window === 'undefined') return {};
  return safeJsonParse<UserSettings>(localStorage.getItem(STORAGE_KEYS.SETTINGS), {
    pushTime: '07:30',
    pushEnabled: true,
  });
}

/** 保存用户设置 */
export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// ============ 学习统计 ============

/** 计算学习统计 */
export function calculateStats(totalExams: number): LearningStats {
  const records = getRecords();
  const completed = records.filter((r) => r.status === 'completed' && r.evaluation);

  const scores = completed.map((r) => r.evaluation?.totalScore || 0);
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const totalMinutes = completed.reduce((sum, r) => {
    if (r.startedAt && r.completedAt) {
      return sum + Math.round((new Date(r.completedAt).getTime() - new Date(r.startedAt).getTime()) / 60000);
    }
    return sum;
  }, 0);

  const recentScores = completed
    .slice(0, 10)
    .map((r) => ({
      date: r.completedAt ? r.completedAt.substring(0, 10) : '',
      score: r.evaluation?.totalScore || 0,
    }));

  // 按类型统计
  const typeMap = new Map<string, { count: number; totalScore: number }>();
  completed.forEach((r) => {
    // 这里需要关联题目类型，简化处理
    const type = '综合';
    const existing = typeMap.get(type) || { count: 0, totalScore: 0 };
    existing.count++;
    existing.totalScore += r.evaluation?.totalScore || 0;
    typeMap.set(type, existing);
  });

  const byTypeStats = Array.from(typeMap.entries()).map(([type, data]) => ({
    type: type as any,
    count: data.count,
    avgScore: data.count > 0 ? Math.round(data.totalScore / data.count) : 0,
  }));

  return {
    totalExams,
    completedCount: completed.length,
    averageScore,
    totalStudyMinutes: totalMinutes,
    recentScores,
    byTypeStats,
  };
}
