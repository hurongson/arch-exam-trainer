'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, PencilRuler, AlertCircle } from 'lucide-react';
import { login, isAuthenticated } from '@/lib/storage';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (login(password)) {
        router.push('/');
      } else {
        setError('密码错误，请重试');
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 shadow-lg shadow-primary-200">
            <PencilRuler className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">一注方案训练</h1>
          <p className="mt-2 text-sm text-gray-500">
            一级注册建筑师考试 · 建筑方案设计（作图题）AI训练平台
          </p>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">请输入访问密码</h2>

          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="访问密码"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-colors focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                autoFocus
              />
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="mt-6 w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? '验证中...' : '进入平台'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            单用户模式 · 数据存储在本地浏览器
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl bg-white/60 p-3">
            <div className="text-lg font-bold text-primary-600">22</div>
            <div className="text-[11px] text-gray-500">历年真题</div>
          </div>
          <div className="rounded-xl bg-white/60 p-3">
            <div className="text-lg font-bold text-primary-600">AI</div>
            <div className="text-[11px] text-gray-500">智能评图</div>
          </div>
          <div className="rounded-xl bg-white/60 p-3">
            <div className="text-lg font-bold text-primary-600">每日</div>
            <div className="text-[11px] text-gray-500">案例推送</div>
          </div>
        </div>
      </div>
    </div>
  );
}
