#!/usr/bin/env node
/**
 * 每日建筑案例推送脚本
 * 用于 GitHub Actions 定时任务调用
 * 每天早上 7:30 触发
 */

const WEBHOOK_URL = process.env.FEISHU_WEBHOOK_URL;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function main() {
  if (!WEBHOOK_URL) {
    console.error('错误：FEISHU_WEBHOOK_URL 环境变量未设置');
    process.exit(1);
  }

  try {
    console.log('开始推送每日建筑案例...');

    // 调用应用的 API 来生成并推送
    const response = await fetch(`${APP_URL}/api/feishu-push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const result = await response.json();

    if (result.success) {
      console.log(`✅ 推送成功：${result.caseName}`);
    } else {
      console.error('❌ 推送失败:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ 推送过程中出现错误:', error);
    process.exit(1);
  }
}

main();
