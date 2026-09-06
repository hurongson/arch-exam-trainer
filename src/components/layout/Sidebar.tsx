'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  PencilRuler,
  History,
  BarChart3,
  Building2,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout, isAuthenticated } from '@/lib/storage';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: '首页', icon: LayoutDashboard },
  { href: '/quiz', label: '真题题库', icon: BookOpen },
  { href: '/records', label: '训练记录', icon: History },
  { href: '/progress', label: '学习进度', icon: BarChart3 },
  { href: '/cases', label: '案例库', icon: Building2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAuthenticated());
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!authed) return null;

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
          <PencilRuler className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900">一注方案训练</div>
          <div className="text-[10px] text-gray-400">建筑方案设计作图题</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-100 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </button>
      </div>
    </aside>
  );
}
