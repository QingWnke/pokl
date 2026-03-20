import { Link, NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Category } from '../types';
import { publicApi } from '../api/public';
import { AdSlot } from './AdSlot';

const navItems = [
  { to: '/', label: '游戏分类' },
  { to: '/ratings', label: '评分与评论' },
  { to: '/popular', label: '热门游戏' },
  { to: '/new', label: '最新上线' },
  { to: '/about', label: '关于我们' },
  { to: '/contact', label: '联系我们' },
  { to: '/admin', label: '后台管理' }
];

export const MainLayout = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sidebarAd, setSidebarAd] = useState<any>();

  useEffect(() => {
    void publicApi.getHome().then((payload) => {
      setCategories(payload.categories);
      setSidebarAd(payload.ads.find((ad) => ad.placement === 'SIDEBAR_VERTICAL'));
    });
  }, []);

  const sidebar = (
    <div className="flex h-full flex-col gap-6 bg-slate-950 px-5 py-6 text-slate-100">
      <Link to="/" className="text-2xl font-black tracking-tight text-white">PlayNexus</Link>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `block rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-brand-600 text-white' : 'hover:bg-white/5 text-slate-300'}`}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">分类</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link key={category._id} to={`/?category=${encodeURIComponent(category.name)}`} className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200 hover:border-brand-500 hover:text-white">
              {category.icon} {category.name}
            </Link>
          ))}
        </div>
      </div>
      <AdSlot ad={sidebarAd} className="h-64" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 md:grid md:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-white/10 md:block">{sidebar}</aside>
      <div className="min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur md:px-8">
          <button onClick={() => setOpen(true)} className="rounded-2xl border border-white/10 px-3 py-2 md:hidden">☰</button>
          <div>
            <p className="text-sm text-slate-400">HTML5 迷你游戏平台</p>
            <h1 className="text-xl font-bold text-white">随时随地畅玩轻量小游戏</h1>
          </div>
          <Link to="/admin" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Admin</Link>
        </header>

        {open ? (
          <div className="fixed inset-0 z-40 bg-slate-950/90 md:hidden">
            <div className="absolute inset-y-0 left-0 w-full max-w-sm border-r border-white/10 bg-slate-950">{sidebar}</div>
            <button onClick={() => setOpen(false)} className="absolute right-6 top-6 rounded-full border border-white/10 px-4 py-2">关闭</button>
          </div>
        ) : null}

        <main className="px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
