import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import { adminApi } from '../api/admin';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MetricsCard } from '../components/MetricsCard';
import { SectionHeader } from '../components/SectionHeader';
import { useFetch } from '../hooks/useFetch';

export const AdminDashboardPage = () => {
  const { data, loading, error } = useFetch(adminApi.getDashboard);
  if (loading) return <LoadingSpinner />;
  if (error || !data) return <div>{error}</div>;

  const chartColors = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

  return (
    <div className="space-y-8">
      <SectionHeader title="数据仪表盘" description="每日/每周/月访问、游戏表现与广告点击率可视化。" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricsCard label="总游戏数" value={data.overview.totalGames} />
        <MetricsCard label="已发布游戏" value={data.overview.publishedGames} />
        <MetricsCard label="用户评论" value={data.overview.totalReviews} />
        <MetricsCard label="独立访客" value={data.overview.uniqueVisitors} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="glass-panel rounded-3xl p-5">
          <h3 className="mb-4 text-lg font-semibold">访问趋势</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={[
              { name: '日', value: data.overview.visitsDaily },
              { name: '周', value: data.overview.visitsWeekly },
              { name: '月', value: data.overview.visitsMonthly }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-panel rounded-3xl p-5">
          <h3 className="mb-4 text-lg font-semibold">广告 CTR 分布</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={data.adPerformance.map((item: any) => ({ name: item.name, value: item.ctr ?? 0 }))} dataKey="value" nameKey="name" outerRadius={110}>
                {data.adPerformance.map((_: any, index: number) => <Cell key={index} fill={chartColors[index % chartColors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="glass-panel rounded-3xl p-5">
        <h3 className="mb-4 text-lg font-semibold">热门游戏表现</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {data.topGames.map((game: any) => (
            <div key={game.name} className="rounded-2xl border border-white/10 p-4">
              <p className="font-semibold text-white">{game.name}</p>
              <p className="mt-2 text-sm text-slate-400">播放量：{game.playCount}</p>
              <p className="text-sm text-slate-400">评分：{game.ratingAverage}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
