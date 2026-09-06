import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '一注方案训练 | 一级注册建筑师考试方案设计训练平台',
  description: '一级注册建筑师考试建筑方案设计（作图题）AI训练平台，含历年真题、专业绘图画布、AI评图、每日案例推送',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
