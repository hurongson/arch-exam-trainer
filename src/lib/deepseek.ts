import OpenAI from 'openai';

/**
 * DeepSeek API 封装
 * DeepSeek 兼容 OpenAI API 格式，使用 openai SDK 调用
 */

const DEFAULT_BASE_URL = 'https://api.deepseek.com';
const DEFAULT_MODEL = 'deepseek-chat';

function getClient(): OpenAI | null {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: process.env.DEEPSEEK_BASE_URL || DEFAULT_BASE_URL,
  });
}

/** 检查 DeepSeek API 是否配置 */
export function isDeepSeekConfigured(): boolean {
  return !!process.env.DEEPSEEK_API_KEY;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** 通用聊天补全 */
export async function chatCompletion(
  messages: ChatMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const client = getClient();
  if (!client) {
    throw new Error('DeepSeek API Key 未配置，请在环境变量中设置 DEEPSEEK_API_KEY');
  }

  const response = await client.chat.completions.create({
    model: options?.model || process.env.DEEPSEEK_MODEL || DEFAULT_MODEL,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 4000,
  });

  return response.choices[0]?.message?.content || '';
}

/**
 * AI 评图
 * 基于 tldraw JSON 数据解析 + 评分标准进行评分
 * @param schemeDescription 方案描述（从 tldraw JSON 解析出的文本描述）
 * @param examInfo 题目信息
 * @param rubric 评分标准
 */
export async function evaluateScheme(
  schemeDescription: string,
  examInfo: { title: string; year: string; designRequirements: string[]; corePoints: string[] },
  rubric: string
): Promise<string> {
  const systemPrompt = `你是一位资深的一级注册建筑师考试评卷专家，拥有20年以上的建筑方案设计（作图题）评卷经验。

请根据以下信息对考生的方案进行专业评分：
1. 考试题目：${examInfo.year}年 ${examInfo.title}
2. 设计要求：${examInfo.designRequirements.join('；')}
3. 核心考点：${examInfo.corePoints.join('；')}
4. 评分标准：${rubric}
5. 考生方案描述：${schemeDescription}

请严格按照评分标准进行扣分制评分，输出格式为 JSON，包含以下字段：
{
  "totalScore": 总分（百分制，0-100）,
  "scoreItems": [
    {"category": "评分大类", "maxScore": 满分, "score": 得分, "deductions": ["扣分项1", "扣分项2"]}
  ],
  "summary": "总体评价（100字以内）",
  "strengths": ["优点1", "优点2"],
  "weaknesses": ["不足1", "不足2"],
  "suggestions": ["改进建议1", "改进建议2"]
}

只输出 JSON，不要输出其他内容。`;

  return chatCompletion(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: '请对上述方案进行评分。' },
    ],
    { temperature: 0.3, maxTokens: 3000 }
  );
}

/**
 * 生成每日建筑案例分析
 */
export async function generateCaseAnalysis(
  caseInfo: { name: string; architect: string; location: string; description: string; designHighlights: string[] }
): Promise<string> {
  const systemPrompt = `你是一位建筑评论家和一级注册建筑师考试辅导专家。请对以下建筑案例进行分析，重点关注其平面布局、立面设计、空间组织对一注方案设计考试的启发。

项目：${caseInfo.name}
建筑师：${caseInfo.architect}
地点：${caseInfo.location}
项目描述：${caseInfo.description}
设计亮点：${caseInfo.designHighlights.join('；')}

请输出以下内容（用中文，总字数300-500字）：
1. 【设计亮点】3-5条核心设计手法
2. 【平面布局分析】功能分区、流线组织、空间关系
3. 【立面设计分析】造型策略、虚实关系、材料运用
4. 【一注考点关联】与一注方案设计考试的关联点和可借鉴手法

格式清晰，适合在飞书消息中阅读。`;

  return chatCompletion(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: '请进行案例分析。' },
    ],
    { temperature: 0.7, maxTokens: 2000 }
  );
}
