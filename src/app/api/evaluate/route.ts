import { NextRequest, NextResponse } from 'next/server';
import { evaluateScheme, isDeepSeekConfigured } from '@/lib/deepseek';
import { getRubricByType } from '@/lib/rubric';

export async function POST(request: NextRequest) {
  try {
    // 检查 API 配置
    if (!isDeepSeekConfigured()) {
      return NextResponse.json(
        { error: 'DeepSeek API Key 未配置，请在环境变量中设置 DEEPSEEK_API_KEY' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { schemeDescription, examInfo } = body;

    if (!schemeDescription || !examInfo) {
      return NextResponse.json(
        { error: '缺少必要参数：schemeDescription 和 examInfo' },
        { status: 400 }
      );
    }

    // 获取对应建筑类型的评分标准
    const rubric = getRubricByType(examInfo.buildingType || '综合');

    // 调用 DeepSeek 评图
    const rawResult = await evaluateScheme(schemeDescription, examInfo, rubric);

    // 解析 JSON 结果
    let parsedResult: any;
    try {
      // 尝试提取 JSON（可能被 markdown 包裹）
      const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
      parsedResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawResult);
    } catch (e) {
      console.error('解析评图结果失败，原始输出：', rawResult);
      // 降级处理
      parsedResult = {
        totalScore: 60,
        maxScore: 100,
        scoreItems: [
          { category: '总平面设计', maxScore: 15, score: 9, deductions: ['AI解析结果格式异常，此项为默认评分'] },
          { category: '功能分区与平面布局', maxScore: 35, score: 21, deductions: [] },
          { category: '流线组织', maxScore: 20, score: 12, deductions: [] },
          { category: '空间设计与规范', maxScore: 15, score: 9, deductions: [] },
          { category: '图面表达与完整性', maxScore: 15, score: 9, deductions: [] },
        ],
        summary: 'AI评图结果解析异常，以下为默认评分。请检查方案数据或重试。',
        strengths: ['方案已完成基本绘图工作'],
        weaknesses: ['AI无法准确解析方案细节，建议人工复核'],
        suggestions: ['建议重新提交评图', '检查方案是否包含足够的绘图元素'],
      };
    }

    return NextResponse.json({
      success: true,
      result: parsedResult,
    });
  } catch (error: any) {
    console.error('评图 API 错误:', error);
    return NextResponse.json(
      { error: error.message || '评图过程中出现错误' },
      { status: 500 }
    );
  }
}
