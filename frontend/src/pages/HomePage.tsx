import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { publicApi } from '../api/public';
import { AdSlot } from '../components/AdSlot';
import { GameCard } from '../components/GameCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SectionHeader } from '../components/SectionHeader';
import { useFetch } from '../hooks/useFetch';
import { Game } from '../types';

export const HomePage = () => {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const selectedCategory = useMemo(() => new URLSearchParams(location.search).get('category') ?? undefined, [location.search]);
  const { data, loading, error, refetch } = useFetch(() => publicApi.getHome({ category: selectedCategory, search }));

  const gridItems: Array<Game | { _id: string; ad: true; placement: string }> = useMemo(() => {
    if (!data) return [];
    const items: Array<Game | { _id: string; ad: true; placement: string }> = [...data.games];
    const ad4 = data.ads.find((ad) => ad.placement === 'GRID_INLINE_4');
    const ad8 = data.ads.find((ad) => ad.placement === 'GRID_INLINE_8');
    if (ad4) items.splice(3, 0, { _id: ad4._id, ad: true, placement: 'GRID_INLINE_4' });
    if (ad8) items.splice(7, 0, { _id: ad8._id, ad: true, placement: 'GRID_INLINE_8' });
    return items;
  }, [data]);

  if (loading) return <LoadingSpinner />;
  if (error || !data) return <div className="rounded-3xl bg-rose-500/10 p-6 text-rose-200">加载失败：{error}</div>;

  const headerAd = data.ads.find((ad) => ad.placement === 'HEADER_BANNER');

  return (
    <div className="space-y-8">
      <AdSlot ad={headerAd} className="h-28 w-full" />
      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-brand-900/60 via-slate-900 to-slate-950 p-6 md:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-brand-100">
              Fast • Responsive • Monetized
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">发现、评分并畅玩精选 HTML5 迷你游戏</h2>
            <p className="text-slate-300">支持分类筛选、评论评分、相关推荐、广告位管理与后台内容运营，桌面与移动端体验统一流畅。</p>
          </div>
          <div className="glass-panel rounded-3xl p-5">
            <p className="text-sm text-slate-300">站点概览</p>
            <div className="mt-3 space-y-2 text-sm text-slate-400">
              <p>• {data.games.length}+ 款已上架小游戏</p>
              <p>• {data.categories.length} 个主分类导航</p>
              <p>• 后台支持 GitHub 开源游戏导入与广告管理</p>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">筛选游戏</h3>
            <p className="text-sm text-slate-400">分类筛选 + 搜索关键词，快速定位感兴趣的内容。</p>
          </div>
          <div className="flex w-full gap-3 md:max-w-xl">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="搜索游戏名称..."
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3"
            />
            <button onClick={() => void refetch()} className="rounded-2xl bg-brand-600 px-5 py-3 font-semibold text-white">搜索</button>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title={selectedCategory ? `${selectedCategory} 分类` : '精选游戏'} description="桌面端 3 列、平板 2 列、手机 1 列响应式布局，广告卡位自动插入。" />
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {gridItems.map((item) => {
            if ('ad' in item) {
              const ad = data.ads.find((entry) => entry.placement === item.placement);
              return <AdSlot key={item._id} ad={ad} className="min-h-[280px] rounded-3xl" />;
            }
            return <GameCard key={item._id} game={item} />;
          })}
        </div>
      </section>
    </div>
  );
};
