import { NextRequest, NextResponse } from 'next/server';
import { generateCaseAnalysis, isDeepSeekConfigured } from '@/lib/deepseek';
import casesData from '@/../data/cases.json';
import type { ArchCase } from '@/types';

/**
 * 飞书推送 API
 * 手动触发每日案例推送到飞书
 */
export async function POST(request: NextRequest) {
  try {
    const webhookUrl = process.env.FEISHU_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { error: '飞书 Webhook URL 未配置，请设置 FEISHU_WEBHOOK_URL 环境变量' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const caseId = body.caseId;

    // 选择案例：指定ID或随机选择
    const cases = casesData as ArchCase[];
    let selectedCase: ArchCase;
    if (caseId) {
      selectedCase = cases.find((c) => c.id === caseId) || cases[0];
    } else {
      // 根据日期选择，确保每天不同
      const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
      );
      selectedCase = cases[dayOfYear % cases.length];
    }

    // 生成 AI 分析
    let analysis = '';
    if (isDeepSeekConfigured()) {
      try {
        analysis = await generateCaseAnalysis({
          name: selectedCase.name,
          architect: selectedCase.architect,
          location: selectedCase.location,
          description: selectedCase.description,
          designHighlights: selectedCase.designHighlights,
        });
      } catch (e) {
        console.error('AI 分析生成失败，使用预设内容', e);
      }
    }

    // 如果 AI 分析失败，使用预设内容
    if (!analysis) {
      analysis = `【设计亮点】
${selectedCase.designHighlights.map((h, i) => `${i + 1}. ${h}`).join('\n')}

【一注考点关联】
${selectedCase.examRelevance.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
    }

    // 构建飞书消息卡片
    const today = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });

    const card = {
      msg_type: 'interactive',
      card: {
        config: { wide_screen_mode: true },
        header: {
          title: {
            tag: 'plain_text',
            content: `🏛️ 每日建筑方案赏析 | ${today}`,
          },
          template: 'blue',
        },
        elements: [
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: `**${selectedCase.name}**\n建筑师：${selectedCase.architect}\n地点：${selectedCase.location} · ${selectedCase.year}年${selectedCase.area ? ` · ${selectedCase.area.toLocaleString()}㎡` : ''}`,
            },
          },
          { tag: 'hr' },
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: `**📋 项目简介**\n${selectedCase.description}`,
            },
          },
          { tag: 'hr' },
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: `**✨ AI 深度分析**\n${analysis}`,
            },
          },
          { tag: 'hr' },
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: `**🏷️ 标签**：${selectedCase.tags.join(' · ')}`,
            },
          },
          {
            tag: 'note',
            elements: [
              {
                tag: 'plain_text',
                content: '一注方案训练 · 每日案例推送 · 坚持积累，方案能力稳步提升',
              },
            ],
          },
        ],
      },
    };

    // 发送到飞书
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });

    const result = await response.json();

    if (result.code !== 0 && result.StatusCode !== 0) {
      return NextResponse.json(
        { error: '飞书推送失败', detail: result },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '推送成功',
      caseName: selectedCase.name,
    });
  } catch (error: any) {
    console.error('飞书推送 API 错误:', error);
    return NextResponse.json(
      { error: error.message || '推送过程中出现错误' },
      { status: 500 }
    );
  }
}

/**
 * GET 方法 - 获取今日推送内容预览
 */
export async function GET() {
  const cases = casesData as ArchCase[];
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const selectedCase = cases[dayOfYear % cases.length];

  return NextResponse.json({
    todayCase: selectedCase,
    totalCases: cases.length,
    webhookConfigured: !!process.env.FEISHU_WEBHOOK_URL,
    deepseekConfigured: !!process.env.DEEPSEEK_API_KEY,
  });
}
