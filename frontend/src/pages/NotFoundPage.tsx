import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
    <p className="text-sm uppercase tracking-[0.3em] text-brand-200">404</p>
    <h2 className="text-4xl font-black text-white">页面不存在</h2>
    <p className="max-w-lg text-slate-400">你访问的页面可能已经移动或删除，返回首页继续探索小游戏。</p>
    <Link to="/" className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white">返回首页</Link>
  </div>
);
