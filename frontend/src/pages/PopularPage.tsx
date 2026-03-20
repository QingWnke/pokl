import { publicApi } from '../api/public';
import { GameCard } from '../components/GameCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SectionHeader } from '../components/SectionHeader';
import { useFetch } from '../hooks/useFetch';

export const PopularPage = () => {
  const { data, loading, error } = useFetch(publicApi.getPopularGames);
  if (loading) return <LoadingSpinner />;
  if (error || !data) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <SectionHeader title="热门游戏" description="按近 7 天播放量默认排序，帮助玩家快速进入平台热门内容。" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.map((game: any) => <GameCard key={game._id} game={game} />)}
      </div>
    </div>
  );
};
