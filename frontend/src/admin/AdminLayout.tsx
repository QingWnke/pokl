import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

const links = [
  { to: '/admin', label: '仪表盘' },
  { to: '/admin/games', label: '游戏管理' },
  { to: '/admin/categories', label: '分类管理' },
  { to: '/admin/reviews', label: '评论审核' },
  { to: '/admin/ads', label: '广告管理' },
  { to: '/admin/settings', label: '系统设置' }
];

export const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 md:grid md:grid-cols-[260px_1fr]">
      <aside className="border-r border-white/10 bg-slate-900/80 p-6">
        <Link to="/" className="text-2xl font-black text-white">PlayNexus CMS</Link>
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <p>{admin?.name}</p>
          <p className="text-xs text-slate-500">{admin?.role}</p>
        </div>
        <nav className="mt-6 space-y-2">
          {links.map((link) => (
            <NavLink key={link.to} end={link.to === '/admin'} to={link.to} className={({ isActive }) => `block rounded-2xl px-4 py-3 ${isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-white/5'}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
          className="mt-6 w-full rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300"
        >
          退出登录
        </button>
      </aside>
      <main className="p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};
