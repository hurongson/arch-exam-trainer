// 一级注册建筑师考试方案训练 - 类型定义

/** 建筑类型枚举 */
export type BuildingType =
  | '交通'
  | '医养'
  | '服务'
  | '文体'
  | '商业'
  | '居住'
  | '工业科研';

/** 面积表项 */
export interface AreaTableItem {
  zone: string; // 功能分区
  rooms: string; // 包含房间
  area: string; // 面积
}

/** 真题图片 */
export interface ExamImage {
  type: 'site' | 'function' | 'area' | 'reference'; // 类型：总平/功能关系/面积表/参考图
  title: string; // 图片标题
  url: string; // 图片路径
  description?: string; // 图片说明
}

/** 真题题目 */
export interface Exam {
  id: string;
  year: string; // 如 "2023", "2022.5"
  title: string; // 题目名称
  buildingType: BuildingType;
  siteSize?: string; // 用地尺寸
  totalArea?: number; // 总建筑面积
  floors?: string; // 层数
  description: string; // 任务描述
  siteConditions: string; // 用地条件
  designRequirements: string[]; // 设计要求
  areaTable?: AreaTableItem[]; // 面积表
  images?: ExamImage[]; // 真题图片
  corePoints: string[]; // 核心考点
  difficulty: 1 | 2 | 3 | 4 | 5; // 难度 1-5
}

/** 训练记录 */
export interface TrainingRecord {
  id: string;
  examId: string;
  examTitle: string;
  examYear: string;
  startedAt: string; // ISO 时间
  completedAt?: string;
  durationMinutes?: number;
  schemeData?: any; // tldraw JSON 数据
  schemeImage?: string; // 方案图 base64 或 URL
  evaluation?: EvaluationResult;
  status: 'in_progress' | 'completed' | 'abandoned';
}

/** 评分项 */
export interface ScoreItem {
  category: string; // 评分大类
  maxScore: number; // 满分
  score: number; // 得分
  deductions: string[]; // 扣分项说明
}

/** AI 评图结果 */
export interface EvaluationResult {
  id: string;
  recordId: string;
  totalScore: number; // 总分（百分制）
  maxScore: number; // 满分
  scoreItems: ScoreItem[]; // 分项得分
  summary: string; // 总体评价
  strengths: string[]; // 优点
  weaknesses: string[]; // 不足
  suggestions: string[]; // 改进建议
  evaluatedAt: string;
  model: string; // 使用的模型
}

/** 案例图片 */
export interface CaseImage {
  type: 'site' | 'plan' | 'elevation' | 'section' | 'analysis' | 'axonometric'; // 类型
  title: string; // 图片标题
  url: string; // 图片路径
  description?: string; // 图片说明
}

/** 建筑案例（用于每日推送） */
export interface ArchCase {
  id: string;
  name: string; // 项目名称
  architect: string; // 建筑师
  location: string; // 地点
  year: number; // 建成年份
  buildingType: BuildingType;
  area?: number; // 建筑面积
  images?: CaseImage[]; // 案例图片
  description: string; // 项目描述
  designHighlights: string[]; // 设计亮点
  examRelevance: string[]; // 与一注考试的关联点
  tags: string[];
}

/** 用户设置 */
export interface UserSettings {
  appPassword?: string;
  deepseekApiKey?: string;
  feishuWebhookUrl?: string;
  pushTime?: string; // 推送时间 "07:30"
  pushEnabled?: boolean;
}

/** 学习统计 */
export interface LearningStats {
  totalExams: number; // 题库总数
  completedCount: number; // 已完成训练数
  averageScore: number; // 平均得分
  totalStudyMinutes: number; // 总学习时长
  recentScores: { date: string; score: number }[]; // 近期得分趋势
  byTypeStats: { type: BuildingType; count: number; avgScore: number }[]; // 按类型统计
}
